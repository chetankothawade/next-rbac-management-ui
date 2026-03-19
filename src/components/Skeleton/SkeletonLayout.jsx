import React from "react";
import SkeletonHeader from "./SkeletonHeader";

const SkeletonLayout = ({ children, headerActions = false }) => {
  return (
    <div className="fade-in">
      <SkeletonHeader showActions={headerActions} />
      <div className="card p-4">{children}</div>
    </div>
  );
};

export default SkeletonLayout;
