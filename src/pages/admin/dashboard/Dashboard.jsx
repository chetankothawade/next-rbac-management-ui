/**
 * Dashboard Page
 * -------------------------------------------------
 */

import React, { useState } from "react";
import LayoutWrapper from "../components/LayoutWrapper";
import { DashboardSkeleton } from "../../../components/Skeleton";



const Dashboard = () => {

  return (
    <LayoutWrapper>
      {/* ======================================================
      PAGE HEADER
  ====================================================== */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0">Dashboard</h4>
          </div>
        </div>
      </div>
    </LayoutWrapper >

  );
};

export default Dashboard;
