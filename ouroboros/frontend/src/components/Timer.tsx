import { useState, useEffect } from "react";

interface TimerProps {
  resetTrigger?: number;
}

const Timer = ({ resetTrigger }: TimerProps) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (resetTrigger) {
      setSeconds(0);
    }
  }, [resetTrigger]);

  // Format MM:SS
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <h2>⏱ Time: {formatTime(seconds)}</h2>
      {/* rest of your UI */}
    </div>
  );
};

export default Timer;
