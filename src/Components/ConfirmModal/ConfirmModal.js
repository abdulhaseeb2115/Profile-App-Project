import React from 'react'

const ConfirmModal = ({ setShowMainModal, setShowConfirmModal }) => {
    return (
        <div className="bg-white rounded-4 border shadow position-absolute translate-middle top-50 start-50 d-flex flex-column align-items-center justify-content-evenly p-4"
            style={{ zIndex: "110", height: "50%", width: "90%" }}
        >

            <h4>Do you want to exit</h4>
            <div>
                <button
                    className="btn rounded-1 btn-outline-success mx-3"
                    onClick={() => setShowConfirmModal(false)}
                >
                    Cancel
                </button>
                <button
                    className="btn rounded-1 btn-danger mx-3 px-4"
                    onClick={() => setShowMainModal(false)}
                >
                    Exit
                </button>
            </div>
        </div>
    )
}

export default ConfirmModal