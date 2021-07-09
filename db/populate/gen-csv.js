const csvWriter = require('csv-write-stream');
const fs = require('fs');
const faker = require('faker');
const { Stream } = require('stream');

const coinflip = () => {
  if (Math.floor(Math.random() * 2) === 1) {
    return true;
  } else {
    return false;
  }
}

const getRandom = (max) => {
  return (Math.floor(Math.random() * max));
}

const capitalizeFirst = (string) => {
  return string[0].toUpperCase() + string.substring(1);
}

const capitalizeAllFirsts = (string) => {
  const stringArray = string.split(' ');
  for (let i = 0; i < stringArray.length; i++) {
    stringArray[i] = capitalizeFirst(stringArray[i]);
  }
  return stringArray.join(' ');
}

const createCategories = (number) => {
  console.log("Writing categories.csv with " + number + " records.");
  const readable = new Stream.Readable();
  readable.pipe(fs.createWriteStream('categories.csv'));
  readable.push("name" + "\n");
  for (let i = 0; i < number; i++) {
    const result = getRandom(100);
    if (result < 30) {
     readable.push(capitalizeFirst(faker.random.word()) + "\n");
    } else if (result < 70) {
      let firstWord = capitalizeFirst(faker.random.word());
      let secondWord = capitalizeFirst(faker.random.word());
      if (result < 50) {
        readable.push(firstWord + " " + secondWord + "\n");
      } else {
        readable.push(firstWord + " & " + secondWord + "\n");
      }
    } else {
      let firstWord = capitalizeFirst(faker.random.word());
      let secondWord = capitalizeFirst(faker.random.word());
      let thirdWord = capitalizeFirst(faker.random.word());
      if (result < 80) {
        readable.push(firstWord + " " + secondWord + " & " + thirdWord + "\n");
      } else if (result < 90) {
        readable.push(firstWord + ", " + secondWord + " & " + thirdWord + "\n");
      } else {
        readable.push(firstWord + " & " + secondWord + " " + thirdWord + "\n");
      }
    }
  }
  readable.push(null);
  console.log("Finished pushing data to categories.csv")
}

const createBooks = (number) => {
  console.log("Creating books.csv with " + number + " records.");
  let onePercent = number / 100;
  let currentChunk = 1;
  const readable = new Stream.Readable();
  readable.pipe(fs.createWriteStream('books.csv'));
  readable.push("title,subtitle,author,narrator,imageUrl,audioSampleUrl,length,version,categories\n");
  for (let i = 0; i < number; i++) {
    const newBook = {
      title: capitalizeAllFirsts(faker.company.bs()),
      subtitle: capitalizeAllFirsts(faker.company.catchPhrase()),
      author: faker.name.findName(),
      narrator: faker.name.findName(),
      imageUrl: faker.image.imageUrl(),
      audioSampleUrl: faker.internet.url(),
      length: (getRandom(29) + 4) + " hours and " + getRandom(60) + " minutes.",
      version: getRandom(100) < 85 ? "Unabridged Audiobook" : "Abridged Audiobook",
      categories: "[{categoryId: " + getRandom(200) + "}, {categoryId: " + getRandom(200) + "}]"
    }
    let stringToPush = "";
    for (let key in newBook) {
      stringToPush += newBook[key] + ",";
    }
    stringToPush += "\n"
    readable.push(stringToPush);
    if (i === currentChunk * onePercent) {
      console.log(currentChunk + "% complete.");
      currentChunk++;
    }
  }
  readable.push(null);
  console.log("Finished pushing data to books.csv");
}

createCategories(200);
createBooks(10000000);
