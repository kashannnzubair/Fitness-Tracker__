export const checkReminders = (reminders) => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' });
  
  reminders.forEach(reminder => {
    if (reminder.time === currentTime) {
      const shouldNotify = reminder.days.length === 0 || reminder.days.includes(currentDay);
      if (shouldNotify && reminder.active) {
        if (Notification.permission === "granted") {
          new Notification("FitTrack Reminder", {
            body: reminder.title,
            icon: "/logo192.png"
          });
        }
      }
    }
  });
};

// Start checking every minute
export const startReminderChecker = (getReminders) => {
  setInterval(async () => {
    const res = await getReminders();
    checkReminders(res.data?.reminders || []);
  }, 60000); // Check every minute
};