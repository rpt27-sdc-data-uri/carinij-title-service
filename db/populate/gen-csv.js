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

const generateRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const generateCreatedAt = () => {
  return generateRandomDate(new Date(2017, 0, 1), new Date());
}

const generateUpdatedAt = (start) => {
  return generateRandomDate(start, new Date());
}

const createCategories = (number) => {
  console.log("Writing categories.csv with " + number + " records.");
  const readable = new Stream.Readable();
  readable.pipe(fs.createWriteStream('categories.csv'));
  readable.push("name, createdAt, updatedAt\n");
  let resultObject = {};
  while (Object.keys(resultObject).length < number) {
    let stringToPush = "";
    const randomNumber = getRandom(100);
    if (randomNumber < 30) {
     stringToPush = capitalizeFirst(faker.random.word());
    } else if (randomNumber < 70) {
      let firstWord = capitalizeFirst(faker.random.word());
      let secondWord = capitalizeFirst(faker.random.word());
      if (randomNumber < 50) {
        stringToPush = firstWord + " " + secondWord;
      } else {
        stringToPush = firstWord + " & " + secondWord;
      }
    } else {
      let firstWord = capitalizeFirst(faker.random.word());
      let secondWord = capitalizeFirst(faker.random.word());
      let thirdWord = capitalizeFirst(faker.random.word());
      if (randomNumber < 80) {
        stringToPush = firstWord + " " + secondWord + " & " + thirdWord;
      } else if (randomNumber < 90) {
        stringToPush = '"'+ firstWord + ', ' + secondWord + ' & ' + thirdWord + '"';
      } else {
        stringToPush = firstWord + " & " + secondWord + " " + thirdWord;
      }
    }
    const createdAtDate = generateCreatedAt();
    resultObject[stringToPush] = stringToPush + "," + createdAtDate.toISOString() + "," + generateUpdatedAt(createdAtDate).toISOString()  + "\n";
  }
  for (let key in resultObject) {
    readable.push(resultObject[key]);
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
  readable.push("title,subtitle,author,narrator,imageUrl,audioSampleUrl,length,version,createdAt,updatedAt\n");
  for (let i = 0; i < number; i++) {
    const createdAtDate = generateCreatedAt();
    const newBook = {
      title: capitalizeAllFirsts(faker.company.bs()) + ",",
      subtitle: capitalizeAllFirsts(faker.company.catchPhrase()) + ",",
      author: faker.name.findName() + ",",
      narrator: faker.name.findName() + ",",
      imageUrl: faker.image.imageUrl() + ",",
      audioSampleUrl: faker.internet.url() + ",",
      length: (getRandom(29) + 4) + " hours and " + getRandom(60) + " minutes" + ",",
      version: getRandom(100) < 85 ? "Unabridged Audiobook" + "," : "Abridged Audiobook" + ",",
      createdAt: createdAtDate.toISOString() + ",",
      updatedAt: generateUpdatedAt(createdAtDate).toISOString()
    }
    let stringToPush = "";
    for (let key in newBook) {
      stringToPush += newBook[key];
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
