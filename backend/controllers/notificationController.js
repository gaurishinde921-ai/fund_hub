let notifications = [];

exports.sendNotification = (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) return res.status(400).json({ message: 'Missing fields' });

  const newNotification = { id: notifications.length + 1, userId, message, read: false };
  notifications.push(newNotification);

  res.status(201).json({ success: true, notification: newNotification });
};

exports.getNotifications = (req, res) => {
  const { userId } = req.params;
  const userNotifications = notifications.filter(n => n.userId === userId);

  res.status(200).json({ notifications: userNotifications });
};
