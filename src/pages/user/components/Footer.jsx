// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row align-items-center">

          <div className="col-sm-6">
            © Copyrights {currentYear} {process.env.NEXT_PUBLIC_SITE_NAME || "NACK"}. All rights reserved.
          </div>

          <div className="col-sm-6 text-end d-none d-sm-block">
            Design &amp; Developed by {process.env.NEXT_PUBLIC_SITE_NAME || "NACK"}
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;

