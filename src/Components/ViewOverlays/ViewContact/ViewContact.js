import React from 'react';
import { AiFillCloseCircle } from "react-icons/ai";


const ViewContact = ({ contact, setViewContact }) => {
    return (
        <div className="AddProject position-absolute top-50 start-50 translate-middle bg-white rounded-4 py-3 ps-5 pe-2 col-10 col-md-8 col-lg-6 d-flex flex-column"
            style={{ height: "50vh", zIndex: "20" }}
        >
            <div className="pe-4 d-flex flex-column justify-content-evenly h-100" style={{ overflow: "auto" }}>

                {/* heading and exit */}
                <div className="container-fluid mg-0 p-0 d-flex justify-content-between align-items-center">
                    <h2 className="fw-bold m-0">Contact</h2>
                    <AiFillCloseCircle size="30px" onClick={() => setViewContact(false)} />
                </div>

                <div className="mb-3">
                    <div className="container border-bottom mt-2">
                        <span className='fw-bold'>Email:&nbsp;&nbsp;</span>
                        <span>{contact.email}</span>
                    </div>

                    <div className="container border-bottom mt-2">
                        <span className='fw-bold'>Phone:&nbsp;&nbsp;</span>
                        <span>{contact.phone}</span>
                    </div>

                    <div className="container border-bottom mt-2">
                        <span className='fw-bold'>Phone:&nbsp;&nbsp;</span>
                        <span>{contact.linkedIn}</span>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ViewContact;