"use client";

import React from "react";

const MOTION_ONLY_PROPS = new Set([
  "animate",
  "exit",
  "initial",
  "layout",
  "layoutId",
  "transition",
  "variants",
  "whileHover",
  "whileTap",
  "whileFocus",
  "whileDrag",
  "whileInView",
  "drag",
  "dragConstraints",
  "dragElastic",
  "dragMomentum",
  "dragTransition",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "viewport",
]);

function stripMotionProps(props) {
  return Object.fromEntries(
    Object.entries(props).filter(([key]) => !MOTION_ONLY_PROPS.has(key))
  );
}

const motion = new Proxy(
  {},
  {
    get(_, tag) {
      const Component = React.forwardRef(({ children, ...props }, ref) => {
        const domProps = stripMotionProps(props);
        return React.createElement(tag, { ...domProps, ref }, children);
      });

      Component.displayName = `motion.${String(tag)}`;
      return Component;
    },
  }
);

export { motion };
export default { motion };
