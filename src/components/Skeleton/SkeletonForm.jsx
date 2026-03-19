
//components\Skeleton\SkeletonForm.js
import React from "react";

const SkeletonForm = ({ fields = 5 }) => {
  return (
    <div className="p-3">

      {/* Form Fields Skeleton */}
      {[...Array(fields)].map((_, i) => (
        <div key={i} className="mb-4">
          {/* Label */}
          <div
            className="skeleton mb-2"
            style={{ width: "160px", height: "16px", borderRadius: "4px" }}
          />
          {/* Input */}
          <div
            className="skeleton"
            style={{ width: "100%", height: "38px", borderRadius: "6px" }}
          />
        </div>
      ))}

      {/* Bottom Action Buttons (Right Aligned Like Screenshot) */}
      <div className="d-flex justify-content-end mt-4 gap-2">
        <div
          className="skeleton"
          style={{ width: "120px", height: "40px", borderRadius: "6px" }}
        />
        <div
          className="skeleton"
          style={{ width: "120px", height: "40px", borderRadius: "6px" }}
        />
      </div>
    </div>
  );
};

export default SkeletonForm;
