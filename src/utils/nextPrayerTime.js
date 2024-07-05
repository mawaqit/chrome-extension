const getNextPrayerTime = (data) => {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const timesInMinutes = Object.entries(data).map(([key, time]) => {
    const [hours, minutes] = time.split(":").map(Number);
    return { key, minutes: hours * 60 + minutes };
  });

  timesInMinutes.sort((a, b) => a.minutes - b.minutes);

  for (let i = 0; i < timesInMinutes.length; i++) {
    if (timesInMinutes[i].minutes > nowMinutes) {
      return timesInMinutes[i].key;
    }
  }

  return timesInMinutes[0].key;
};
export default getNextPrayerTime;
