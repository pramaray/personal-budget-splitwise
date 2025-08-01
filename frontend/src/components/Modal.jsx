export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm text-white rounded-3xl border border-gray-700 w-full max-w-md p-8 relative shadow-2xl">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 text-2xl w-8 h-8 flex items-center justify-center rounded-xl border border-gray-600 hover:border-white hover:bg-white hover:text-black transition-all duration-300 hover:scale-105"
          aria-label="Close"
        >
          &times;
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
}

