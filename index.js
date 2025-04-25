const express = require('express');
const app = express();
const userRoutes = require('./routes/users');
const mealRoutes = require('./routes/meals');

app.use(express.json());

// Rotas
app.use('/users', userRoutes);
app.use('/meals', mealRoutes);

app.listen(3000, () => {
  console.log('🚀 API Daily Diet rodando na porta 3000');
});
