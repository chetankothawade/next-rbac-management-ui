import { useEffect } from "react";

/**
 * Custom hook to auto-scroll to the first form error.
 * @param {Object} errors - React Hook Form errors object
 */
export const UseAutoScrollToError = (errors) => {
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const firstError = Object.keys(errors)[0];
            // Try to find by data-field first (for Controller fields), then by name (for registered fields)
            let element = document.querySelector(`[data-field="${firstError}"]`);
            if (!element) {
                element = document.querySelector(`[name="${firstError}"]`);
            }

            if (element) {
                // Find the input inside the element to scroll to
                const input = element.querySelector('input, select, textarea');
                const target = input || element;

                // Use scrollIntoView for better positioning
                target.scrollIntoView({ behavior: "smooth", block: "center" });

                // Focus the input
                if (input) {
                    input.focus({ preventScroll: true });
                } else {
                    target.focus({ preventScroll: true });
                }
            }
        }
    }, [errors]);
};