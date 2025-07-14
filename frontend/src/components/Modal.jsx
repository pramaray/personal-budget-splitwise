export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 text-gray-100 rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
        >
          &times;
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
}

// export default function Modal({ title, onClose, children }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
//       <div className="bg-gray-900 text-gray-100 rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
//         {/* Title */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-semibold">{title}</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-200 text-2xl leading-none"
//           >
//             ×
//           </button>
//         </div>

//         {/* Content */}
//         <div>{children}</div>
//       </div>
//     </div>
//   );
// }
