// Import packages
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

// routes
app.get('/hello', (req, res) => {
  res.render('pages/index');
});

app.get('/searches/new', (req, res) => {
  res.render('pages/searches/new.ejs');
});
app.get('/', (req, res) => {
  res.render('pages/index');
});
app.post('/searches', searchHandler);

//search function
function searchHandler(req, res) {
  let url;
  let input = req.body.search;
  if (req.body.searchBy === 'title') {
    url = `https://www.googleapis.com/books/v1/volumes?q=${input}+intitle;`;
  }
  if (req.body.searchBy === 'author') {
    url = `https://www.googleapis.com/books/v1/volumes?q=${input}+inauthor`;
  }
  superagent
    .get(url)
    .then(bookApiData => bookApiData.body.items.map(item => new Book(item)))
    .then(element => {
      res.render('pages/searches/show', { books: element });
    })
    .catch(err => console.log(err));
}

function Book(data) {
  this.title = data.volumeInfo.title;
  this.authors = data.volumeInfo.authors;
  this.description = data.volumeInfo.description;
  this.image = data.volumeInfo.imageLinks.smallThumbnail;
}

app.listen(PORT, () => {
  console.log(`THE SERVER IS LISTENING TO PORT ${PORT}`);
});
