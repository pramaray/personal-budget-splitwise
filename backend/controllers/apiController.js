// controllers/apiController.js
exports.ping = (req, res) => {
  res.json({ message: 'pong 🎯' });
};

exports.health = (req, res) => {
  res.json({ db: 'connected' });
};
