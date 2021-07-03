const db = require('../db.js');

const createNewBook = () => {
  const myBook = {
    "title": "A Promised Land",
    "subtitle": "",
    "author": "Smoochy Boochy",
    "narrator": "Barack Obama",
    "imageUrl": "https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.jpg",
    "audioSampleUrl": "https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.mp3",
    "length": "29:10",
    "version": "Unabridged Audiobook"
  }

  return myBook;
}

const createManyNewBooks = (number) => {
  let resultArray = [];
  for (let i = 0; i < number; i++) {
    resultArray[i] = createNewBook();
  }
  return resultArray;
}

const createNewCategory = () => {
  const myCategory = {
    "name": "Science Faction"
  }

  return myCategory;
}

module.exports.manyNewBooks = createManyNewBooks;
module.exports.newCategory = createNewCategory;