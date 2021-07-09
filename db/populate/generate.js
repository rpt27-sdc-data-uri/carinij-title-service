const db = require('../db.js');

const createNewBook = (thisBookCategories) => {
  const myBook = {
    "title": "A Promised Land",
    "subtitle": "",
    "author": "Smoochy Boochy",
    "narrator": "Barack Obama",
    "imageUrl": "https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.jpg",
    "audioSampleUrl": "https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.mp3",
    "length": "29:10",
    "version": "Unabridged Audiobook",
    "categoryId": thisBookCategories
  }

  return myBook;
}

const createManyNewBooks = (number) => {
  let resultArray = [];
  for (let i = 0; i < number; i++) {
    let thisBookCategories = []; 
    const numberOfCategories = Math.ceil(Math.random() * 3);
    for (let i = 0; i < numberOfCategories; i++) {
      thisBookCategories.push(Math.ceil(Math.random() * 200));
    }
    console.log("thisBookCategories: " + thisBookCategories);
    resultArray[i] = createNewBook(thisBookCategories);
  }
  return resultArray;
}

const createNewCategory = () => {
  const myCategory = {
    "name": Math.random() * 10000
  }

  return myCategory;
}

const createManyNewCategories = (number) => {
  console.log("Creating many new categories.");
  let resultArray = [];
  for (let i = 0; i < number; i++) {
    resultArray[i] = createNewCategory();
  }
  console.log("Category list: ");
  console.log(resultArray);
  return resultArray;
}

module.exports.manyNewBooks = createManyNewBooks;
module.exports.manyNewCategories = createManyNewCategories;
