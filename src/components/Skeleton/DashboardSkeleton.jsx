import React from "react";
import { Card, Row, Col } from "react-bootstrap";

/* -------------------------
   Generic Skeleton Element
--------------------------- */
const Skeleton = ({ height = 20, width = "100%", className = "" }) => {
  return (
    <div
      className={`bg-light rounded mb-2 shimmer ${className}`}
      style={{
        height,
        width,
        opacity: 0.7,
      }}
    />
  );
};

/* -------------------------
   Dashboard Skeleton Layout
--------------------------- */
const DashboardSkeleton = () => (
  <>
    {/* KPI Card skeletons */}
    <Row className="g-3 mb-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <Col md={3} sm={6} key={i}>
          <Card className="shadow-sm card-height-100 p-4">
            <Skeleton height={10} width="35%" className="skeleton-line" />
            <Skeleton height={28} width="55%" className="mt-2" />
            <Skeleton height={10} width="65%" className="mt-2" />
          </Card>
        </Col>
      ))}
    </Row>

    {/* Revenue + Status skeleton */}
    <Row className="g-3 mb-3">
      <Col lg={8}>
        <Card className="shadow-sm p-3 card-height-100">
          <Skeleton height={20} width="30%" />
          <Skeleton height={40} width="50%" className="mt-2" />
          <Skeleton height={12} width="60%" className="mt-2" />
          <div className="mt-4">
            <Skeleton height={160} width="100%" />
          </div>
        </Card>
      </Col>

      <Col lg={4}>
        <Card className="shadow-sm p-3 card-height-100">
          <Skeleton height={20} width="40%" />

          {[1, 2, 3].map((i) => (
            <div key={i} className="mt-3">
              <Skeleton height={12} width="70%" />
              <Skeleton height={10} width="100%" className="mt-2" />
            </div>
          ))}

          <hr />

          <Skeleton height={12} width="50%" />
          <Skeleton height={24} width="70%" className="mt-2" />
        </Card>
      </Col>
    </Row>

    {/* Recent Invoices skeleton */}
    <Row className="g-3">
      <Col lg={8}>
        <Card className="shadow-sm p-3">
          <Skeleton height={20} width="30%" />

          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="d-flex justify-content-between my-3">
              <Skeleton height={12} width="20%" />
              <Skeleton height={12} width="20%" />
              <Skeleton height={12} width="15%" />
              <Skeleton height={12} width="15%" />
              <Skeleton height={12} width="10%" />
            </div>
          ))}
        </Card>
      </Col>

      <Col lg={4}>
        <Card className="shadow-sm p-3 mb-3">
          <Skeleton height={20} width="40%" />
          <Skeleton height={40} className="mt-3" />
          <Skeleton height={40} className="mt-2" />
          <Skeleton height={40} className="mt-2" />
        </Card>


        <Card className="shadow-sm p-3">
          <Skeleton height={20} width="40%" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={12} width="70%" className="mt-2" />
          ))}
        </Card>
      </Col>
    </Row>
  </>
);

export default DashboardSkeleton;
