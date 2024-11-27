// VideoCall.tsx
import React, { useEffect, useRef, useState } from 'react';
import { X, Mic, MicOff, Camera, CameraOff, PhoneOff,Clock } from 'lucide-react';
import { useCreateVideoCallMutation } from '../../slices/apiUserSlice';

interface VideoCallProps {
  userId: string;
  matchId: string;
  socket: any;
  onClose: () => void;
  isInitiator: boolean;
  incomingOffer?: RTCSessionDescriptionInit;
  partnerName: string; 
}

const VideoCall: React.FC<VideoCallProps> = ({
  userId,
  matchId,
  socket,
  onClose,
  isInitiator,
  incomingOffer,
  partnerName,
}) => {

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const iceCandidatesRef = useRef<RTCIceCandidate[]>([]);
  
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string>('Initializing...');

  const [createVideoCallHistory] = useCreateVideoCallMutation();
  const callStartTimeRef = useRef<number>(Date.now());
  const [callDuration, setCallDuration] = useState(0);
  const callDurationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCallDurationTracking = () => {
    callStartTimeRef.current = Date.now();
    callDurationIntervalRef.current = setInterval(() => {
      const duration = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
      setCallDuration(duration);
    }, 1000);
  };

  // Stop call duration tracking and log call history
  const stopCallDurationTracking = async (status: 'completed' | 'rejected' | 'cancelled') => {
    if (callDurationIntervalRef.current) {
      clearInterval(callDurationIntervalRef.current);

      console.log('duuuuuuuuuuuuuuuuuuuuuuu',callDuration)
    }
    
    if (callDuration > 0) {

      console.log("Payload for video call history:", {
        userId,
        partnerId: matchId,
        callDuration,
        callType: isInitiator ? "initiated" : "received",
        status,
      });
      
      try {
        const res = await createVideoCallHistory({
          userId,
          partnerId: matchId,
          callDuration,
          callType: isInitiator ? 'initiated' : 'received',
          status,
          // timestamp: new Date().toISOString(),
          // connectionType: connectionStatus // Potentially log connection status
        }).unwrap();
  
        console.log(`Video call history logged: ${status} call`, res);
      } catch (error) {
        console.error(`Failed to log ${status} call history`, error);
      }
    }
  };

  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ],
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // Setup local stream first
        const stream = await setupLocalStream();
        if (!stream || !mounted) return;

        // Create peer connection
        const pc = createPeerConnection();
        if (!pc || !mounted) return;

        if (isInitiator) {
          // Create and send offer
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          console.log('Sending call offer to:', matchId);
          socket.emit('call-user', {
            offer,
            to: matchId,
            from: userId
          });
          setConnectionStatus('Calling...');
        } else if (incomingOffer) {
          // Handle incoming offer
          await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          console.log('Sending call answer to:', matchId);
          socket.emit('call-accepted', {
            answer,
            to: matchId,
            from: userId
          });
          setConnectionStatus('Connecting...');
        }
       
      } catch (error) {
        console.error('Error in call initialization:', error);
        setConnectionStatus('Failed to initialize call');
        onClose();
      }
    };

    initialize();

    return () => {
      mounted = false;
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (connectionStatus === 'Connected') {
      startCallDurationTracking();
    }
  }, [connectionStatus]);

  useEffect(() => {
    if (!socket) return;

    const handleCallAccepted = async ({ answer, from }: { answer: RTCSessionDescriptionInit, from: string }) => {
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
          console.log('Call accepted, remote description set');
          setConnectionStatus('Connected');
        }
      } catch (error) {
        console.error('Error handling call accepted:', error);
        setConnectionStatus('Connection failed');
      }
    };

    const handleIceCandidate = async ({ candidate, from }: { candidate: RTCIceCandidateInit, from: string }) => {
      try {
        if (peerConnectionRef.current?.remoteDescription) {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          iceCandidatesRef.current.push(new RTCIceCandidate(candidate));
        }
      } catch (error) {
        console.error('Error handling ICE candidate:', error);
      }
    };

    socket.on('call-accepted', handleCallAccepted);
    socket.on('ice-candidate', handleIceCandidate);
    socket.on('call-ended', handleCallEnd);
    socket.on('call-rejected', handleCallEnd);

    return () => {
      socket.off('call-accepted', handleCallAccepted);
      socket.off('ice-candidate', handleIceCandidate);
      socket.off('call-ended', handleCallEnd);
      socket.off('call-rejected', handleCallEnd);
    };
  }, [socket]);

  const createPeerConnection = () => {
    try {
      const pc = new RTCPeerConnection(configuration);

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('Sending ICE candidate to:', matchId);
          socket.emit('ice-candidate', {
            candidate: event.candidate,
            to: matchId,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        console.log('Connection state changed:', pc.connectionState);
        setConnectionStatus(pc.connectionState);
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          handleCallEnd();
        }
      };

      pc.ontrack = (event) => {
        console.log('Received remote track');
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Add local tracks to peer connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          if (localStreamRef.current) {
            pc.addTrack(track, localStreamRef.current);
          }
        });
      }

      peerConnectionRef.current = pc;
      return pc;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      return null;
    }
  };

  const setupLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setConnectionStatus('Failed to access camera/microphone');
      return null;
    }
  };

  const handleCallEnd = () => {
    console.log('Ending call');
    stopCallDurationTracking('completed');
    cleanup();
    socket.emit('end-call', { to: matchId });
    onClose();
  };

  // const handleCallReject = () => {
  //   // Log call history as rejected
  //   stopCallDurationTracking('rejected');
    
  //   cleanup();
  //   socket.emit('call-rejected', { to: matchId });
  //   onClose();
  // };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    localStreamRef.current = null;
    peerConnectionRef.current = null;
  };
  
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative w-full max-w-6xl h-[80vh] bg-gray-900 rounded-lg overflow-hidden">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <span className="text-white px-3 py-1 rounded bg-gray-800">
            {connectionStatus}
          </span>
          <span className="text-white px-3 py-1 rounded bg-gray-800 flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {new Date(callDuration * 1000).toISOString().substr(11, 8)}
          </span>
          <span className="text-white text-lg font-semibold mr-4">
            Call with {partnerName} {/* Added partner name display */}
          </span>
          <button
            onClick={handleCallEnd}
            className="p-2 bg-red-500 rounded-full hover:bg-red-600 text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="relative h-full">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          <div className="absolute top-4 right-16 w-48 h-36 rounded-lg overflow-hidden border-2 border-white">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full ${
                isAudioEnabled ? 'bg-gray-700' : 'bg-red-500'
              } hover:opacity-80 transition-colors`}
            >
              {isAudioEnabled ? (
                <Mic className="h-6 w-6 text-white" />
              ) : (
                <MicOff className="h-6 w-6 text-white" />
              )}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full ${
                isVideoEnabled ? 'bg-gray-700' : 'bg-red-500'
              } hover:opacity-80 transition-colors`}
            >
              {isVideoEnabled ? (
                <Camera className="h-6 w-6 text-white" />
              ) : (
                <CameraOff className="h-6 w-6 text-white" />
              )}
            </button>

            <button
              onClick={handleCallEnd}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            >
              <PhoneOff className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;