// src/components/Loader.js
import React from "react";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div
      id="elmLoader"
      className="d-flex flex-column align-items-center justify-content-center my-4 w-100"
      role="status"
    >
      <div className="spinner-border text-primary avatar-sm" aria-hidden="true"></div>
      
      {/* Accessible label for screen readers */}
      <span className="visually-hidden">{message}</span>
    </div>
  );
};

export default Loader;
