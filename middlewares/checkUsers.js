const db = require('../data/db');

module.exports = function (req, res, next) {
  const userId = req.headers['user-id'];
  if (!userId) return res.status(400).json({ error: 'Header "user-id" é obrigatório' });

  const user = db.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  req.user = user;
  next();
};
