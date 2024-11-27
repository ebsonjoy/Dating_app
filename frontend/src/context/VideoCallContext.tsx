// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { useSocketContext } from './SocketContext';
// import { RootState } from '../store'
// import VideoCall from '../pages/userPages/videoCall';
// import IncomingCallModal from '../components/user/IncomingCallModal';

// interface CallState {
//     isReceivingCall: boolean;
//     from: string;
//     offer: RTCSessionDescriptionInit | null;
//     callerName?: string;
//   }

// interface VideoCallContextType {
//   showVideoCall: boolean;
//   callState: CallState;
//   handleAcceptCall: () => void;
//   handleRejectCall: () => void;
//   initiateCall: (matchId: string, matchName: string) => void;
//   endCall: () => void;
// }

// const VideoCallContext = createContext<VideoCallContextType | null>(null);

// export const useVideoCall = () => {
//   const context = useContext(VideoCallContext);
//   if (!context) {
//     throw new Error('useVideoCall must be used within a VideoCallProvider');
//   }
//   return context;
// };

// export const VideoCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [showVideoCall, setShowVideoCall] = useState(false);
//   const [callState, setCallState] = useState<CallState>({
//     isReceivingCall: false,
//     from: '',
//     offer: null,
//     callerName: ''
//   });

//   const { socket } = useSocketContext();
//   const { userInfo } = useSelector((state: RootState) => state.auth);
//   const userId = userInfo?._id;

//   useEffect(() => {
//     if (!socket) return;

//     socket.on('incoming-call', ({ from, offer, callerName }) => {
//       console.log('Received incoming call from:', callerName);
//       setCallState({
//         isReceivingCall: true,
//         from,
//         offer,
//         callerName
//       });
//     });

//     socket.on('call-ended', () => {
//       setShowVideoCall(false);
//       setCallState({
//         isReceivingCall: false,
//         from: '',
//         offer: null,
//         callerName: ''
//       });
//     });

//     socket.on('call-rejected', () => {
//       setShowVideoCall(false);
//       setCallState({
//         isReceivingCall: false,
//         from: '',
//         offer: null,
//         callerName: ''
//       });
//     });

//     return () => {
//       socket.off('incoming-call');
//       socket.off('call-ended');
//       socket.off('call-rejected');
//     };
//   }, [socket]);

//   const handleAcceptCall = () => {
//     setShowVideoCall(true);
//     setCallState(prev => ({
//       ...prev,
//       isReceivingCall: true
//     }));
//   };

//   const handleRejectCall = () => {
//     if (socket && callState.from) {
//       socket.emit('call-rejected', { to: callState.from });
//     }
//     setCallState({
//       isReceivingCall: false,
//       from: '',
//       offer: null,
//       callerName: ''
//     });
//   };

//   const initiateCall = (matchId: string, matchName: string) => {
//     if (userId && socket) {
//       setShowVideoCall(true);
//       setCallState({
//         isReceivingCall: false,
//         from: matchId,
//         offer: null,
//         callerName: matchName
//       });
//     }
//   };

//   const endCall = () => {
//     if (socket && callState.from) {
//       socket.emit('end-call', { to: callState.from });
//     }
//     setShowVideoCall(false);
//     setCallState({
//       isReceivingCall: false,
//       from: '',
//       offer: null,
//       callerName: ''
//     });
//   };

//   return (
//     <VideoCallContext.Provider
//       value={{
//         showVideoCall,
//         callState,
//         handleAcceptCall,
//         handleRejectCall,
//         initiateCall,
//         endCall
//       }}
//     >
//       {children}
//       {showVideoCall && (
//         <VideoCall
//           userId={userId!}
//           matchId={callState.from}
//           socket={socket!}
//           onClose={endCall}
//           isInitiator={!callState.isReceivingCall}
//           incomingOffer={callState.offer}
//         />
//       )}
//       {callState.isReceivingCall && !showVideoCall && (
//         <IncomingCallModal
//           callerName={callState.callerName || 'Someone'}
//           onAccept={handleAcceptCall}
//           onReject={handleRejectCall}
//         />
//       )}
//     </VideoCallContext.Provider>
//   );
// };