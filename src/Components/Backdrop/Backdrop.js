import React from 'react'

const Backdrop = () => {
    return (
        <div className="Backdrop position-absolute top-0 start-0 h-100 w-100 bg-black opacity-50"
            style={{ zIndex: "10" }}
        ></div>
    )
}

export default Backdrop