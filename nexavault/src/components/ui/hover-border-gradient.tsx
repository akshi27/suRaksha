"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  clockwise = true,
  ...props
}: React.PropsWithChildren<{
  as?: React.ElementType;
  containerClassName?: string;
  className?: string;
  duration?: number;
  clockwise?: boolean;
} & React.HTMLAttributes<HTMLElement>>) {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<Direction>("TOP");

  const rotateDirection = (current: Direction): Direction => {
    const dirs: Direction[] = ["TOP", "RIGHT", "BOTTOM", "LEFT"];
    const i = dirs.indexOf(current);
    return clockwise ? dirs[(i + 1) % 4] : dirs[(i + 3) % 4];
  };

  const map: Record<Direction, string> = {
    TOP: "radial-gradient(20.7% 50% at 50% 0%, white 0%, transparent 100%)",
    LEFT: "radial-gradient(16.6% 43.1% at 0% 50%, white 0%, transparent 100%)",
    BOTTOM: "radial-gradient(20.7% 50% at 50% 100%, white 0%, transparent 100%)",
    RIGHT: "radial-gradient(16.2% 41.2% at 100% 50%, white 0%, transparent 100%)",
  };

  const highlight = "radial-gradient(75% 181% at 50% 50%, #3275F8 0%, transparent 100%)";

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prev) => rotateDirection(prev));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered, duration, clockwise]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={clsx(
        "relative flex rounded-2xl bg-black/20 hover:bg-black/10 p-px transition-all",
        containerClassName
      )}
      {...props}
    >
      <div className={clsx("relative z-10 w-full", className)}>{children}</div>
      <motion.div
        className="absolute inset-0 rounded-2xl z-0"
        style={{ filter: "blur(3px)" }}
        initial={{ background: map[direction] }}
        animate={{ background: hovered ? [map[direction], highlight] : map[direction] }}
        transition={{ ease: "linear", duration }}
      />
    </Tag>
  );
}
