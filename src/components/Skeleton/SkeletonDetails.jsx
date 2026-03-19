// SkeletonDetailsTable.jsx
import React from "react";

const SkeletonDetailsTable = ({ rows = 8 }) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered">
        <tbody>
          {[...Array(rows)].map((_, i) => (
            <tr key={i}>
              {/* Left Column (Label) */}
              <td style={{ width: "25%" }}>
                <div
                  className="skeleton"
                  style={{ width: "120px", height: "16px" }}
                ></div>
              </td>

              {/* Right Column (Value) */}
              <td>
                <div
                  className="skeleton"
                  style={{ width: "60%", height: "18px" }}
                ></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonDetailsTable;
