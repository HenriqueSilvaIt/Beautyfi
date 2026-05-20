import { useEffect, useState } from "react";

export function useCurrentTime() {
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${now.getHours()}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(
        `${now.getHours()}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")}`,
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return time;
}
