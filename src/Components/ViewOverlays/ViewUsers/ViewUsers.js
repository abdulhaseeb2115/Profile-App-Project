import React from 'react';
import { AiFillCloseCircle } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';


const ViewUsers = ({ users, setViewUsers }) => {
    let navigate = useNavigate();


    return (
        <div className="AddProject position-absolute top-50 start-50 translate-middle bg-white rounded-4 py-3 ps-5 pe-2 col-10 col-md-8 col-lg-6 d-flex flex-column"
            style={{ maxHeight: "80vh", zIndex: "20" }}
        >
            <div className="pe-4 d-flex flex-column h-100 w-100" style={{ overflow: "auto" }}>
                {/* heading and exit */}
                <div className=" m-0 p-0 d-flex justify-content-between align-items-center">
                    <h2 className="fw-bold m-0">Users</h2>
                    <AiFillCloseCircle size="30px" onClick={() => setViewUsers(false)} />
                </div>


                <div>
                    {
                        users.map(({ image, user_id, name }, i) =>
                            <>
                                <div
                                    className="rounded-4 shadow-sm d-flex align-items-center border bg-light my-3 py-2 px-4"
                                    role={"button"}
                                    key={i}
                                    onClick={() => {
                                        setViewUsers(false);
                                        navigate(`/user/${user_id}`)
                                    }}  >

                                    {/* image */}
                                    <div
                                        className="rounded-circle border overflow-hidden bg-light d-flex flex-column align-items-center"
                                        style={{ width: "60px", height: "60px" }}
                                    >
                                        <img
                                            className="h-100 w-auto"
                                            src={image !== "" ? image : "../profile.png"}
                                            alt={"User_Image"}
                                        />
                                    </div>

                                    {/* name */}
                                    <h5
                                        className='ms-4 pt-1 fw-bold'>
                                        {name}
                                    </h5>
                                </div>
                            </>
                        )
                    }

                </div>


            </div>
        </div >
    )
}

export default ViewUsers;