import React from 'react'

const ConfirmModalBackdrop = () => {
    return (
        <div className="Backdrop position-absolute top-0 start-0 h-100 w-100 bg-white opacity-50 rounded-4"
            style={{ zIndex: "100" }}
        ></div>
    )
}

export default ConfirmModalBackdrop