const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts } = require('./utility/contacts');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const app = express();
const port = 3000;

// gunakan ejs
app.set('view engine', 'ejs'); // Third-party Middleware
app.use(expressLayouts); // Built-in Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
  cookie: { maxAge: 6000 },
  secret: 'secret',
  resave: true,
  saveUninitialized: true
})
);
app.use(flash());

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
    msg: req.flash('msg'),
  });
});

// halaman form tambah data contact
app.get('/contacts/add', (req, res) => {
  res.render('add-contact', {
    title: 'Tambah Data Contact',
    layout: 'layouts/main-layout'
  });
});

// proses data contact
app.post('/contacts', [
  body('nama').custom((value) => {
    const duplikat = cekDuplikat(value);
    if (duplikat) {
      throw new Error('Nama contact sudah digunakan!');
    }
    return true;
  }),
  check('email', 'Email tidak valid!').isEmail(),
  check('noHP', 'No HP tidak valid!').isMobilePhone('id-ID'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('add-contact', {
      title: 'Tambah Data Contact',
      layout: 'layouts/main-layout',
      errors: errors.array(),
    });
  } else {
    addContact(req.body);
    // kirimkan flash message
    req.flash('msg', 'Data contact berhasil ditambahkan!');
    res.redirect('/contacts');
  }
});

// proses delete contact
app.get('/contacts/delete/:nama', (req, res) => {
  const contact = findContact(req.params.nama);

  // jika contact tidak ada
  if (!contact) {
    res.status(404);
    res.send('<h1>404</h1>');
  } else {
    deleteContact(req.params.nama);
    req.flash('msg', 'Data contact berhasil dihapus!');
    res.redirect('/contacts');
  }
});

// form ubah data contact
app.get('/contacts/edit/:nama', (req, res) => {
  const contact = findContact(req.params.nama);

  res.render('edit-contact', {
    title: 'Edit Data Contact',
    layout: 'layouts/main-layout',
    contact,
  });
});

// proses update data
app.post('/contacts/update', [
  body('nama').custom((value, { req }) => {
    const duplikat = cekDuplikat(value);
    if (value !== req.body.oldNama && duplikat) {
      throw new Error('Nama contact sudah digunakan!');
    }
    return true;
  }),
  check('email', 'Email tidak valid!').isEmail(),
  check('noHP', 'No HP tidak valid!').isMobilePhone('id-ID'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('edit-contact', {
      title: 'Edit Data Contact',
      layout: 'layouts/main-layout',
      errors: errors.array(),
      contact: req.body,
    });
  } else {
    updateContacts(req.body);
    // kirimkan flash message
    req.flash('msg', 'Data contact berhasil diubah!');
    res.redirect('/contacts');
  }
});

// halaman detail contact
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