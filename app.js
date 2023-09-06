const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { loadContact, findContact } = require('./utility/contacts');
const app = express();
const port = 3000;

// gunakan ejs
app.set('view engine', 'ejs'); // Third-party Middleware
app.use(expressLayouts); // Built-in Middleware
app.use(express.static('public'));

app.get('/', (req, res) => {
  // res.sendFile('./index.html', { root: __dirname });
  const mahasiswa = [
    {
      nama: 'Kipli',
      email: 'kipli@gmail.com',
    },
    {
      nama: 'Erik',
      email: 'kipli@gmail.com',
    },
    {
      nama: 'Doddy',
      email: 'kipli@gmail.com',
    },
  ]
  res.render('index', {
    layout: 'layouts/main-layout',
    nama: 'Kipli',
    title: 'Halaman Home',
    mahasiswa,
  });
});
app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layout',
    title: 'Halaman About'
  });
});
app.get('/contacts', (req, res) => {
  const contacts = loadContact();
  
  res.render('contacts', {
    layout: 'layouts/main-layout',
    title: 'Halaman Contacs',
    contacts,
  });
});

app.get('/contacts/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  
  res.render('detail', {
    layout: 'layouts/main-layout',
    title: 'Halaman Detail Contact',
    contact,
  });
});

app.use('/', (req, res) => {
  res.status(404);
  res.send('<h1>404</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});