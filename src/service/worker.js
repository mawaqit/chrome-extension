chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    unitName: {
      Fajr: false,
      Dhuhr: false,
      Asr: false,
      Maghrib: false,
      Isha: false,
    },
  });
  fetchDataFromAPI();
  createDailyAlarm();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("Alarm triggered:", alarm.name);
  if (alarm.name === "fetchData") {
    fetchDataFromAPI();
  } else {
    showNotification(alarm.name);
  }
});

const createDailyAlarm = async () => {
  const now = new Date();
  const millisTillMidnight =
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) -
    now;

  chrome.alarms.create("fetchData", {
    when: Date.now() + millisTillMidnight,
    periodInMinutes: 1440,
  });

  const prayerTime = await getPrayerTime();
  chrome.storage.local.get("unitName", (result) => {
    for (const [key, value] of Object.entries(result.unitName)) {
      let [hours, minutes] = prayerTime[key].split(":");
      if (value === true) {
        createNotificationAlarm(key, hours, minutes);
      }
    }
  });
};
const createNotificationAlarm = (name, hour, minute) => {
  const now = new Date();
  const targetTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    0,
    0
  );
  if (targetTime > now) {
    const millisTillTime = targetTime - now;
    chrome.alarms.create(name, {
      when: Date.now() + millisTillTime,
      periodInMinutes: 1440,
    });
  }
};

const showNotification = (time) => {
  chrome.storage.local.get("fetchedData", (result) => {
    const data = result.fetchedData || "No data available";
    chrome.notifications.create({
      type: "basic",
      iconUrl:
        "../../../dist/images/apple-icon-57x57.cd4dd987179efa275648b5ac0d824010.png",
      title: `Notification for ${time}`,
      message: `Data: ${data}`,
    });
  });
};
const fetchDataFromAPI = async () => {
  const data = {
    Fajr: "03:57",
    Dhuhr: "12:59",
    Asr: "18:11",
    Maghrib: "20:12",
    Isha: "22:02",
  };
  try {
    chrome.storage.local.set({ timing: data });
  } catch (error) {
    console.error("Error during data recovery:", error);
  }
};
const getPrayerTime = async () => {
  return new Promise((resolve) => {
    chrome.storage.local.get("timing", (result) => {
      resolve(result.timing);
    });
  });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "createDailyAlarm") {
    createDailyAlarm()
      .then(() => {
        sendResponse({ status: "Alarm created" });
      })
      .catch((error) => {
        sendResponse({ status: "Error", message: error.message });
      });
    return true;
  } else if (message.action === "deleteAlarms") {
    deleteAlarms(message.message);
  }
});

const deleteAlarms = (name) => {
  chrome.alarms.clear(name, function (wasCleared) {
    if (wasCleared) {
      console.log(`The ${name} alarm has been successfully cleared.`);
    } else {
      console.log(`The ${name} alarm could not be cleared.`);
    }
  });
};
