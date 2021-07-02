const db = require('../db.js');

const createNewBook = db.Book.create({
  "title": "A Promised Land",
  "subtitle": "",
  "author": "Snooky Fooky",
  "narrator": "Barack Obama",
  "imageUrl": "https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.jpg",
  "audioSampleUrl": "https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.mp3",
  "length": "29:10",
  "version": "Unabridged Audiobook"
})

module.exports.createNewBook = createNewBook;