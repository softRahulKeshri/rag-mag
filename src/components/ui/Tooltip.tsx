import React, { useState, useRef, useEffect } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

/**
 * Tooltip Component
 *
 * Displays a tooltip with full content when text is truncated or hovered
 * Handles positioning, visibility, and accessibility
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className = "",
  position = "top",
  delay = 300,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Check if content is truncated
  useEffect(() => {
    const element = tooltipRef.current?.querySelector(
      "[data-tooltip-content]"
    ) as HTMLElement;
    if (element) {
      setIsVisible(
        element.scrollWidth > element.clientWidth ||
          element.scrollHeight > element.clientHeight
      );
    }
  }, [content]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setShowTooltip(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowTooltip(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Don't render tooltip if content is not truncated
  if (!isVisible) {
    return <div className={className}>{children}</div>;
  }

  const getPositionClasses = () => {
    switch (position) {
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2";
      default: // top
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    }
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={tooltipRef}
    >
      <div data-tooltip-content>{children}</div>

      {showTooltip && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-200 ${getPositionClasses()}`}
          role="tooltip"
          aria-label={content}
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
              position === "bottom"
                ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                : position === "top"
                ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                : position === "left"
                ? "right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
                : "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
            }`}
          />
        </div>
      )}
    </div>
  );
};
