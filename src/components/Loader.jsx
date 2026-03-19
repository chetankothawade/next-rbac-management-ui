// src/components/Loader.js
import React from "react";

const Loader = () => {
    return (
        <div id="elmLoader" className="d-flex justify-content-center my-4" style={{
            left: "5%",
            right: "5%"
        }}>
            <div className="spinner-border text-primary avatar-sm" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default Loader;
