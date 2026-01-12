let settingsData = [];

exports.getSettings = (req, res) => {
  const { userId } = req.params;
  const userSettings = settingsData.find(s => s.userId === userId);
  if (!userSettings) return res.status(404).json({ message: 'No settings found' });

  res.status(200).json({ settings: userSettings });
};

exports.updateSettings = (req, res) => {
  const { userId } = req.params;
  const newSettings = req.body;

  const index = settingsData.findIndex(s => s.userId === userId);
  if (index !== -1) settingsData[index] = { userId, ...newSettings };
  else settingsData.push({ userId, ...newSettings });

  res.status(200).json({ success: true, settings: newSettings });
};
