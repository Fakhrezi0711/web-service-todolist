const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Todo } = require('./models');

const app = express();
app.use(express.json());

const SECRET_KEY = 'secretkey123';

// Middleware untuk otentikasi JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Endpoint Register
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Endpoint Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Endpoint Membuat ToDo baru
app.post('/todos', authenticateJWT, async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = await Todo.create({ title, description, userId: req.user.id });
    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Endpoint Melihat semua ToDo
app.get('/todos', authenticateJWT, async (req, res) => {
  try {
    const todos = await Todo.findAll({ where: { userId: req.user.id } });
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Endpoint Melihat detail ToDo
app.get('/todos/:id', authenticateJWT, async (req, res) => {
  try {
    const todo = await Todo.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!todo) {
      return res.status(404).json({ message: 'ToDo not found' });
    }

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Endpoint Mengubah ToDo
app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!todo) {
      return res.status(404).json({ message: 'ToDo not found' });
    }

    const { title, description } = req.body;
    todo.title = title;
    todo.description = description;
    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Endpoint Menghapus ToDo
app.delete('/todos/:id', authenticateJWT, async (req, res) => {
  try {
    const todo = await Todo.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!todo) {
      return res.status(404).json({ message: 'ToDo not found' });
    }

    await todo.destroy();
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Endpoint Menghapus semua ToDo
app.delete('/todos', authenticateJWT, async (req, res) => {
  try {
    await Todo.destroy({ where: { userId: req.user.id } });
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Menjalankan server
app.listen(3030, () => {
  console.log('Server is running on port 3030');
});
