import React from "react";

const SidebarSkeleton = ({
    count = 6,
    showIcon = true,
    textWidth = "75%",
}) => {
    return (
        <ul className="navbar-nav px-3">
            {Array.from({ length: count }).map((_, i) => (
                <li key={i} className="nav-item mb-3">
                    <div className="d-flex align-items-center gap-3">
                        {showIcon && (
                            <div className="skeleton skeleton-icon" />
                        )}

                        <div
                            className="skeleton skeleton-text"
                            style={{ width: textWidth }}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default SidebarSkeleton;
