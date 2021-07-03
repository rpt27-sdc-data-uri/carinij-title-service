const db = require('../db.js');
const generateData = require('./generate');

const totalRecordsToCreate = 10000000;
const chunkSize = 20000;
const numChunks = totalRecordsToCreate / chunkSize;
const parallels = 20;
const chunksPerParallel = numChunks / parallels;

const times = (n, fn, context) => {
  for (let i = 0; i < n; i++) {
    fn.call(null, context);
  }
}

const populateDatabase = () => {
  console.log("Populating database.");
  db.Book.sync({force: true})
  .then(() => {
    for (let i = 0; i < parallels; i++) {
      console.log("Initializing parallel " + i + ".");
      createChunk(i, 1);
    }
  })
  // .then(() => {
  //   db.Category.sync()
  //   .then(() => {
  //     db.Category.create(generateData.newCategory());
  //   })
  //   .catch((err) => {
  //     console.log("Error in category generation: " + err);
  //   })
  // })
  .catch((err) => {
    console.log("Error in populating database: " + err);
  })
}

const createChunk = (chunkMultiplier, chunkCounter) => {
  let currentChunk = (chunkMultiplier * chunksPerParallel) + chunkCounter;
  console.log("Starting on chunk #" + currentChunk + " of " + numChunks + ".");
  db.Book.bulkCreate(generateData.manyNewBooks(20000))
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