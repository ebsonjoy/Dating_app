import React, { useEffect, useRef, useState } from "react";
import { X, Mic, MicOff, Camera, CameraOff, PhoneOff } from "lucide-react";
import { useCreateVideoCallMutation } from "../../slices/apiUserSlice";
import { Socket } from "socket.io-client";

interface VideoCallProps {
  userId: string;
  matchId: string;
  socket: Socket 
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
  const callStartTimeRef = useRef<number | null>(null);
  const [createVideoCall] = useCreateVideoCallMutation();

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Initializing...");
  const configuration: RTCConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const stream = await setupLocalStream();
        if (!stream || !mounted) return;

        const pc = createPeerConnection();
        if (!pc || !mounted) return;

        if (isInitiator) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          socket.emit("call-user", {
            offer,
            to: matchId,
            from: userId,
          });
          setConnectionStatus("Calling...");
        } else if (incomingOffer) {
          await pc.setRemoteDescription(
            new RTCSessionDescription(incomingOffer)
          );
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          socket.emit("call-accepted", {
            answer,
            to: matchId,
            from: userId,
          });
          setConnectionStatus("Connecting...");
        }
      } catch (error) {
        console.error("Error in call initialization:", error);
        setConnectionStatus("Failed to initialize call");
        onClose();
      }
    };

    initialize();

    return () => {
      mounted = false;
      cleanup();
    };
  }, [incomingOffer, isInitiator]);

  useEffect(() => {
    if (!socket) return;

    const handleCallAccepted = async ({
      answer,
    }: {
      answer: RTCSessionDescriptionInit;
    }) => {
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
          setConnectionStatus("Connected");
        }
      } catch (error) {
        console.error("Error handling call accepted:", error);
        setConnectionStatus("Connection failed");
      }
    };

    const handleIceCandidate = async ({
      candidate,
    }: {
      candidate: RTCIceCandidateInit;
    }) => {
      try {
        const candidateObj = new RTCIceCandidate(candidate);
        if (peerConnectionRef.current?.remoteDescription) {
          await peerConnectionRef.current.addIceCandidate(candidateObj);
        } else {
          iceCandidatesRef.current.push(candidateObj);
        }
      } catch (error) {
        console.error("Error handling ICE candidate:", error);
      }
    };

    socket.on("call-accepted", handleCallAccepted);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("call-ended", handleCallEnd);

    return () => {
      socket.off("call-accepted", handleCallAccepted);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("call-ended", handleCallEnd);
    };
  }, [socket]);

  const createPeerConnection = (): RTCPeerConnection | null => {
    try {
      const pc = new RTCPeerConnection(configuration);

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            to: matchId,
          });
        }
      };

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      pc.onconnectionstatechange = () => {
        setConnectionStatus(pc.connectionState);
        if (pc.connectionState === "connected") {
          callStartTimeRef.current = Date.now();
        }
        if (
          pc.connectionState === "disconnected" ||
          pc.connectionState === "failed"
        ) {
          handleCallEnd();
        }
      };

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      peerConnectionRef.current = pc;
      return pc;
    } catch (error) {
      console.error("Error creating peer connection:", error);
      return null;
    }
  };

  const setupLocalStream = async (): Promise<MediaStream | null> => {
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
      console.error("Error accessing media devices:", error);
      setConnectionStatus("Failed to access camera/microphone");
      return null;
    }
  };

  const handleCallEnd = () => {
    // Calculate call duration
    const callEndTime = Date.now();
    const duration = callStartTimeRef.current
      ? Math.floor((callEndTime - callStartTimeRef.current) / 1000)
      : 0;

    // Determine call status
    const callStatus = duration !== 0 ? "ended" : "missed";

    // Create call history
    createVideoCall({
      callerId: userId,
      receiverId: matchId,
      type: "video-call",
      duration,
      status: callStatus,
    });

    socket.emit("end-call", { to: matchId });
    cleanup();
    onClose();
  };

  const cleanup = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    peerConnectionRef.current?.close();
    localStreamRef.current = null;
    peerConnectionRef.current = null;
  };

  const toggleAudio = () => {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative w-full max-w-6xl h-[80vh] bg-gray-900 rounded-lg overflow-hidden">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <span className="text-white px-3 py-1 rounded bg-gray-800">
            {connectionStatus}
          </span>
          <span className="text-white text-lg font-semibold mr-4">
            Call with {partnerName}
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
                isAudioEnabled ? "bg-gray-700" : "bg-red-500"
              }`}
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
                isVideoEnabled ? "bg-gray-700" : "bg-red-500"
              }`}
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
