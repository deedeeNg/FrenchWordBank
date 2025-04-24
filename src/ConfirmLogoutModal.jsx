import React from 'react';

const ConfirmLogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 animate-fade-in">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-5">
          Confirm Logout
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to log out?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-lg transition duration-200"
          >
            Yes, Log Out
          </button>
          <button
            onClick={onCancel}
            className="border border-gray-300 hover:border-gray-500 text-gray-700 hover:text-gray-900 font-medium px-5 py-2 rounded-lg transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;
