import { useEffect, useRef, useState } from 'react';

export default function AnimatedNumber({ value = 0, duration = 650 }) {
  const numericValue = Number(value) || 0;
  const [display, setDisplay] = useState(0);
  const previous = useRef(0);

  useEffect(() => {
    const startValue = previous.current;
    const difference = numericValue - startValue;
    const startTime = performance.now();
    let frameId;

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startValue + difference * eased));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    previous.current = numericValue;
    return () => cancelAnimationFrame(frameId);
  }, [numericValue, duration]);

  return <>{display}</>;
}
