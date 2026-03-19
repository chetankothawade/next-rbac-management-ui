import React from "react";
import { Row, Col } from "react-bootstrap";

const SkeletonHeader = ({ showActions = false }) => {
  return (
    <div className="mb-4">
      {/* Title + Breadcrumb (ALWAYS) */}
      <Row className="align-items-center mb-3">
        <Col>
          <div
            className="skeleton"
            style={{ width: "140px", height: "26px" }}
          />
        </Col>

        <Col className="text-end">
          <div
            className="skeleton ms-auto"
            style={{ width: "180px", height: "14px" }}
          />
        </Col>
      </Row>

      {/* Search + Button (ONLY LIST PAGES) */}
      {showActions && (
        <Row className="align-items-center">
          <Col md={6}>
            <div
              className="skeleton"
              style={{
                width: "280px",
                height: "38px",
                borderRadius: "6px",
              }}
            />
          </Col>

          <Col md={6} className="text-end">
            <div
              className="skeleton ms-auto"
              style={{
                width: "120px",
                height: "38px",
                borderRadius: "6px",
              }}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default SkeletonHeader;
