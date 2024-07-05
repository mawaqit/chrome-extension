import clsx from "clsx";
import React, { useEffect, useState } from "react";
import PrayerTime from "../components/PrayerTime.jsx";
import getNextPrayerTime from "../utils/nextPrayerTime.js";
const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

const App = () => {
  const [prayerTimes, setPrayerTimes] = useState({});
  const [nextPrayerTime, setNextPrayerTime] = useState(null);
  useEffect(() => {
    chrome.storage.local.get("timing", (result) => {
      if (result.timing) {
        setPrayerTimes(result.timing);
        setNextPrayerTime(getNextPrayerTime(result.timing));
      }
    });
  }, []);

  return (
    <div className="h-80 w-60">
      <h1 className="text-2xl text-center mb-6">Mosque</h1>
      {Object.keys(prayerTimes).length > 0 ? (
        prayerOrder.map(
          (key) =>
            prayerTimes[key] && (
              <PrayerTime
                className={clsx(
                  "my-4",
                  nextPrayerTime === key
                    ? "bg-primary text-white"
                    : "bg-secondary"
                )}
                key={key}
                unitName={key}
                time={prayerTimes[key]}
              />
            )
        )
      ) : (
        <p>Loading schedules ...</p>
      )}
    </div>
  );
};

export default App;
