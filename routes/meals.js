const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../data/db');
const checkUser = require('../middlewares/checkUser');

// Middleware pra validar usuário por header
router.use(checkUser);

// Criar refeição
router.post('/', (req, res) => {
  const { name, description, date, time, inDiet } = req.body;
  const meal = {
    id: uuidv4(),
    userId: req.user.id,
    name,
    description,
    datetime: `${date} ${time}`,
    inDiet
  };

  db.meals.push(meal);
  res.status(201).json(meal);
});

// Listar refeições do usuário
router.get('/', (req, res) => {
  const userMeals = db.meals.filter(m => m.userId === req.user.id);
  res.json(userMeals);
});

// Visualizar uma refeição
router.get('/:id', (req, res) => {
  const meal = db.meals.find(m => m.id === req.params.id && m.userId === req.user.id);
  if (!meal) return res.status(404).json({ error: 'Refeição não encontrada' });

  res.json(meal);
});

// Editar refeição
router.put('/:id', (req, res) => {
  const meal = db.meals.find(m => m.id === req.params.id && m.userId === req.user.id);
  if (!meal) return res.status(404).json({ error: 'Refeição não encontrada' });

  Object.assign(meal, req.body);
  res.json(meal);
});

// Apagar refeição
router.delete('/:id', (req, res) => {
  const index = db.meals.findIndex(m => m.id === req.params.id && m.userId === req.user.id);
  if (index === -1) return res.status(404).json({ error: 'Refeição não encontrada' });

  db.meals.splice(index, 1);
  res.status(204).send();
});

// Métricas
router.get('/metrics/stats', (req, res) => {
  const meals = db.meals.filter(m => m.userId === req.user.id);
  const total = meals.length;
  const inDiet = meals.filter(m => m.inDiet).length;
  const outDiet = total - inDiet;

  // Melhor sequência
  let streak = 0, best = 0;
  for (const meal of meals) {
    if (meal.inDiet) {
      streak++;
      best = Math.max(best, streak);
    } else {
      streak = 0;
    }
  }

  res.json({ total, inDiet, outDiet, bestSequence: best });
});

module.exports = router;
