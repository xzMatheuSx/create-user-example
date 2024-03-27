const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const usersFilePath = 'db.json';

app.use(bodyParser.json());


app.get('/api/users', (req, res) => {
    try {
      const users = JSON.parse(fs.readFileSync(usersFilePath));// le o conteudo do arquivo db.json
      res.status(200).json(users);
    } catch (error) {
      console.error('Erro ao ler o arquivo de usuários:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
      const newUser = { name, email, password };
      
    let users = [];
    try {
      users = JSON.parse(fs.readFileSync(usersFilePath));
    } catch (error) {
      console.error('Erro ao ler o arquivo de usuários:', error);
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
      }
      
    users.push(newUser);

    // Salva a lista atualizada de usuários no arquivo JSON
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
