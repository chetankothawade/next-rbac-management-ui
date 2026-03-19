import React from "react";

/* ---------------- FIXED COLUMNS ---------------- */
const FIXED_START = [{ key: "index", width: 30 }];

const FIXED_END = [
  { key: "created_at", width: 130 },
  { key: "status", width: 80 },
  { key: "action", width: 140 },
];

const SkeletonTable = ({
  rows = 8,
  columns = null,       // full config (optional)
  columnCount = null,   // quick mode (optional)
}) => {
  let dynamicColumns = [];

  /* ---------- OPTION A: Explicit columns ---------- */
  if (Array.isArray(columns) && columns.length) {
    dynamicColumns = columns;
  }

  /* ---------- OPTION B: Count-based columns ---------- */
  if (!dynamicColumns.length && columnCount) {
    dynamicColumns = Array.from({ length: columnCount }).map((_, i) => ({
      key: `col_${i}`,
      width: 120 + (i % 2) * 40,
    }));
  }

  const finalColumns = [
    ...FIXED_START,
    ...dynamicColumns,
    ...FIXED_END,
  ];

  return (
    <table className="table align-middle mb-0">
      {/* ------------ Header ------------ */}
      <thead>
        <tr>
          {finalColumns.map((_, i) => (
            <th key={i}>
              <div
                className="skeleton"
                style={{ height: "14px", width: "60%" }}
              />
            </th>
          ))}
        </tr>
      </thead>

      {/* ------------ Body ------------ */}
      <tbody>
        {[...Array(rows)].map((_, rowIndex) => (
          <tr key={rowIndex}>
            {finalColumns.map((col, colIndex) => (
              <td key={colIndex}>
                {col.key === "action" ? (
                  <div className="d-flex gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="skeleton"
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "6px",
                        }}
                      />
                    ))}
                  </div>
                ) : col.key === "status" ? (
                  <div
                    className="skeleton"
                    style={{
                      width: "70px",
                      height: "22px",
                      borderRadius: "12px",
                    }}
                  />
                ) : (
                  <div
                    className="skeleton"
                    style={{
                      width: col.width ?? 120,
                      height: "22px",
                    }}
                  />
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SkeletonTable;


// USAGE

// <SkeletonTable
//   rows={10}
//   columns={[
//     { key: "name", width: 160 },
//     { key: "email", width: 220 },
//     { key: "phone", width: 120 },
//   ]}
// />

// <SkeletonTable rows={10} columnCount={5} />
//columnCount Inner columns count except fixed columns