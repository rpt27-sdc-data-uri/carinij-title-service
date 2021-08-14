const express  = require('express');
const app = express();
const cors = require('cors');
const Book = require('../db/models/book.js');
const morgan = require('morgan');
const redis = require('redis');
const client = redis.createClient(6379, '3.101.142.34');

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('short'));

console.log("Routes up and running.");

client.on("error", function(error) {
  console.error(error);
});

client.on("connect", function() {
  console.log("Successfully connected to Redis server.");
});

// GET routes
app.get('/api/book/:id', (req, res) => {
  // console.log("Received GET request to /api/book/" + req.params.id);
  client.get(req.params.id, (err, data) => {
    if (err) {
      console.error("Error retrieving from cache: " + err);
      res.send(err);
    }
    if (data) {
      res.send(data);
    } else {
      Book.getById(req.params.id)
      .then((result) => {
        client.set(req.params.id, JSON.stringify(result));
        res.send(result);
      })
      .catch((err) => {
        res.status(500);
        console.error("Error retrieving from db: " + err);
        res.send(err);
      });
    }

  })
});

app.get('/api/books', (req, res) => {
  console.log("Received GET request to /api/books; processing.")
  //need to convert query sting into array of ids
    const ids = req.query.ids ? req.query.ids.split(',').map(string => parseInt(string)) : req.body.ids;
  Book.getByIds(ids)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500);
      console.log('db err: ', err);
      res.send(err);
    })
});

app.get('/api/book/:id/related', (req, res) => {
  Book.getRelatedById(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500);
      console.log('db err: ', err);
      res.send(err);
    });
});

// POST route
app.post('/api/book/', (req, res) => {
  Book.createNewBook(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500);
      console.log('db err: ', err);
      res.send(err);
    });
});

// PUT route
// app.put('/api/book/:id', (req, res) => {
//   Book.getById(req.params.id)
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => {
//       res.status(500);
//       console.log('db err: ', err);
//       res.send(err);
//     });
// });

// DELETE route
app.delete('/api/book/:id', (req, res) => {
  console.log("Received request to /delete");
  Book.deleteById(req.params.id)
    .then((result) => {
      console.log('Deleted ' + result + ' rows.');
      res.send("Successfully deleted book at id: " + req.params.id);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.log('db err: ', err);
      res.send(err);
    });
});

//module is exported for testing
//see start.js for app.listen and port
module.exports = app;