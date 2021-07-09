const db = require('../db.js');
const generateData = require('./generate');

const totalRecordsToCreate = 20000;
const chunkSize = 20000;
const numChunks = totalRecordsToCreate / chunkSize;
const parallels = 1;
const chunksPerParallel = numChunks / parallels;

const populateDatabase = () => {
  console.log("Populating database.");
  let categoryList = [];
  db.Category.sync({force: true})
  .then(() => {
    categoryList = generateData.manyNewCategories(200);
  })
  .then(() => {
    db.Category.bulkCreate(categoryList, { include: db.books })
    .then((result) => {
      console.log(result);
    });
  })
  .then(() => {
    db.Book.sync({force: true})
    .then(() => {
      for (let i = 0; i < parallels; i++) {
        console.log("Initializing parallel " + i + ".");
        createChunk(i, 1);
      }
    })
  })
  .catch((err) => {
    console.log("Error in populating database: " + err);
  })
}

const createChunk = (chunkMultiplier, chunkCounter) => {
  let currentChunk = (chunkMultiplier * chunksPerParallel) + chunkCounter;
  console.log("Starting on chunk #" + currentChunk + " of " + numChunks + ".");
  db.Book.bulkCreate(generateData.manyNewBooks(20000), { include: db.categories })
  .then(() => {
    console.log("Chunk " + currentChunk + " complete.");
    chunkCounter++;
    if (chunkCounter <= chunksPerParallel) {
      createChunk(chunkMultiplier, chunkCounter);
    }
  })
  .catch((err) => {
    console.log("Error in bulkCreate on chunk " + i + ": " + err);
  })
}

populateDatabase();