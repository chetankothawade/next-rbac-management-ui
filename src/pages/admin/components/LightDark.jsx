import React from "react";

const layoutModeTypes = {
    LIGHTMODE: "light",
    DARKMODE: "dark",
};

const LightDark = ({ layoutMode, onChangeLayoutMode }) => {
    const nextMode =
        layoutMode === layoutModeTypes.DARKMODE
            ? layoutModeTypes.LIGHTMODE
            : layoutModeTypes.DARKMODE;

    return (
        <div className="ms-1 header-item d-none d-sm-flex">
            <button
                type="button"
                onClick={() => onChangeLayoutMode(nextMode)}
                className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle light-dark-mode"
            >
                <i
                    className={`bx ${layoutMode === layoutModeTypes.DARKMODE
                            ? "bx-sun"
                            : "bx-moon"
                        } fs-22`}
                />
            </button>
        </div>
    );
};

export default LightDark;
