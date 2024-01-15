/* eslint-disable react/prop-types */

const Modal = ({ isOpen, closeModal, redirectToDashboard }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="modal-content bg-white p-4 rounded-md">
        <p className="mb-4">Leaving the page will exit the game room.</p>
        <div className="flex justify-between">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={closeModal}
          >
            Close
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={redirectToDashboard}
          >
            Redirect to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
