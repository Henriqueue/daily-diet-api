const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../data/db');

// Criar usuário
router.post('/', (req, res) => {
  const { name } = req.body;
  const id = uuidv4();

  db.users.push({ id, name });
  res.status(201).json({ id, name });
});

// Middleware para autenticação fake
router.use('/:id/*', (req, res, next) => {
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

  req.user = user;
  next();
});

module.exports = router;