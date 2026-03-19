// SkeletonTableList.jsx
import React from "react";

const SkeletonTableList = ({ rows = 8, columns = 6 }) => {
  return (
    <table className="table align-middle">
      <thead>
        <tr>
          {[...Array(columns)].map((_, i) => (
            <th key={i}> <div
              className="skeleton"
              style={{ height: "14px", width: "50%" }}
            /></th>
          ))}
        </tr>
      </thead>

      <tbody>
        {[...Array(rows)].map((_, row) => (
          <tr key={row}>
            {[...Array(columns)].map((_, col) => (
              <td key={col}>
                <div
                  className="skeleton"
                  style={{ width: `${75 + Math.random() * 60}px`, height: "20px" }}
                ></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SkeletonTableList;
