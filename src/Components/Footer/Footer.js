import React from "react";
import { useNavigate } from "react-router-dom";



const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="w-100 mt-auto bg-white">
            <div className="w-100 position-relative py-2">
                <div className="ps-3 p-md-0 text-md-center">
                    <span>
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRD9watd98GuxuplYkqW5OizlYfQa_Iy4_3g&usqp=CAU"
                            alt=""
                            height={"20px"}
                            width={"20px"}
                        />
                    </span>
                    <span className="ms-2">© 2022</span>
                </div>
                <div className="position-absolute end-0 top-0 bottom-0 d-flex align-items-center" >
                    <a
                        className="text-decoration-none small"
                        href="#1"
                        onClick={() => navigate("/terms")}
                    >
                        privacy policy
                    </a>
                    <a
                        className="text-decoration-none small mx-2"
                        href="#2"
                        onClick={() => navigate("/terms")}
                    >
                        terms of service
                    </a>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
