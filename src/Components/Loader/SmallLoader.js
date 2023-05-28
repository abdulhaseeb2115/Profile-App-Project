import React from "react";
import "./SmallLoader.css";

const SmallLoader = () => {
    return (
        <div className="SmallLoader">

            <div className="lds-ring-small">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default SmallLoader;
