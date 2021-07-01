const db = require('../db.js');
const generateData = require('./generate');

// const totalRecordsToCreate = 10000000;

const populateDatabase = () => {
  db.Book.sync()
  .then(() => {
    generateData.createNewBook;
  })
  .catch((err) => {
    console.log("Error: " + err);
  })
}

populateDatabase();