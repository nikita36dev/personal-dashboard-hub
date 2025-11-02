export const notifications = {
  // Request permission
  requestPermission: async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  // Show notification
  show: (title, options = {}) => {
    if (Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        ...options
      });
    }
  },

  // Pomodoro notifications
  pomodoroComplete: (type) => {
    const messages = {
      work: {
        title: 'Work Session Complete!',
        body: 'Great job! Time for a break.'
      },
      break: {
        title: 'Break Over!',
        body: 'Ready to focus again?'
      },
      longBreak: {
        title: 'Long Break Complete!',
        body: 'Refreshed and ready to go!'
      }
    };

    const message = messages[type] || messages.work;
    return notifications.show(message.title, { body: message.body });
  },

  // Task reminder
  taskReminder: (taskTitle) => {
    return notifications.show('Task Reminder', {
      body: `Don't forget: ${taskTitle}`,
      tag: 'task-reminder'
    });
  },

  // Habit reminder
  habitReminder: (habitName) => {
    return notifications.show('Habit Reminder', {
      body: `Time to complete: ${habitName}`,
      tag: 'habit-reminder'
    });
  },

  // Achievement notification
  achievement: (title, message) => {
    return notifications.show(`Achievement: ${title}`, {
      body: message,
      tag: 'achievement'
    });
  }
};

export default notifications;
