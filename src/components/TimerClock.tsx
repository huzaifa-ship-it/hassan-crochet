import React, { useEffect, useState } from "react";

const COOLDOWN_HOURS = 7;
const STORAGE_KEY = "cooldown_end_time";

const TimerClock = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Initialize or load existing timer
  useEffect(() => {
    const savedEndTime = localStorage.getItem(STORAGE_KEY);

    let endTime: number;

    if (savedEndTime) {
      endTime = parseInt(savedEndTime, 10);
    } else {
      endTime = Date.now() + COOLDOWN_HOURS * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, endTime.toString());
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = endTime - now;
      setTimeLeft(diff > 0 ? diff : 0);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format time
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <p className="text-red-500  font-extrabold text-lg">
        {timeLeft > 0 ? formatTime(timeLeft) : "Cooldown Finished"}
      </p>
    </div>
  );
};

export default TimerClock;
