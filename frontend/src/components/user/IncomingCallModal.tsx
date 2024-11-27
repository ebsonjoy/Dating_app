// interface IncomingCallModalProps {
//     callerName: string;
//     onAccept: () => void;
//     onReject: () => void;
//   }
  
//   const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
//     callerName,
//     onAccept,
//     onReject
//   }) => {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
//         <div className="bg-white p-6 rounded-lg shadow-xl">
//           <h3 className="text-lg font-semibold mb-4">
//             Incoming Video Call from {callerName}
//           </h3>
//           <div className="flex gap-4 justify-center">
//             <button
//               onClick={onAccept}
//               className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//             >
//               Accept
//             </button>
//             <button
//               onClick={onReject}
//               className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//             >
//               Decline
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   export default IncomingCallModal