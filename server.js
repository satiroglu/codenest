const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Basit bir veri yapısı ile kodları saklayacağız
let snippets = [];

// Yeni snippet oluştur
app.post('/snippets', (req, res) => {
  const { code, language, expiry } = req.body;
  const id = uuidv4().slice(0, 6); // Kod için benzersiz ID
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + (expiry === "1d" ? 1 : expiry === "1w" ? 7 : 0));

  const snippet = { id, code, language, created_at: new Date(), expiry: expiryDate };
  snippets.push(snippet);

  res.json({ id, url: `https://kodly.vercel.app/${id}` });
});

// Snippet görüntüle
app.get('/snippets/:id', (req, res) => {
  const snippet = snippets.find(s => s.id === req.params.id);
  if (!snippet) return res.status(404).send("Snippet not found");

  res.json(snippet);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));