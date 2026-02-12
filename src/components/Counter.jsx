import React, { useState, useEffect } from "react";

export const Counter = ({
  end,
  duration = 2000,
  suffix = "",
  startAnimate = false,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimate) return;

    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration, startAnimate]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};
