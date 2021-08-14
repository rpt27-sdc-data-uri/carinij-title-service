const fs = require('fs');
const faker = require('faker');
const { Stream } = require('stream');

const TARGET_DATABASE = 'neo4j';

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

  const readable = new Stream.Readable();

  if (TARGET_DATABASE === 'neo4j') {
    console.log("Writing categories-neo4j.csv with " + number + " records.");
    readable.pipe(fs.createWriteStream('categories-neo4j.csv'));
    readable.push("categoryId:ID(Category),name,createdAt,updatedAt\n");
  } else {
    console.log("Writing categories.csv with " + number + " records.");
    readable.pipe(fs.createWriteStream('categories.csv'));
    readable.push("name,createdAt,updatedAt\n");
  }

  let resultObject = {};
  let currentIndex = 0;
  while (currentIndex < number - 1) {
    currentIndex = Object.keys(resultObject).length;
    let stringToPush = "";
    if (TARGET_DATABASE === 'neo4j') {
      stringToPush += (currentIndex + 1) + ",";
    }
    const randomNumber = getRandom(100);
    if (randomNumber < 30) {
     stringToPush += capitalizeFirst(faker.random.word());
    } else if (randomNumber < 70) {
      let firstWord = capitalizeFirst(faker.random.word());
      let secondWord = capitalizeFirst(faker.random.word());
      if (randomNumber < 50) {
        stringToPush += firstWord + " " + secondWord;
      } else {
        stringToPush += firstWord + " & " + secondWord;
      }
    } else {
      let firstWord = capitalizeFirst(faker.random.word());
      let secondWord = capitalizeFirst(faker.random.word());
      let thirdWord = capitalizeFirst(faker.random.word());
      if (randomNumber < 80) {
        stringToPush += firstWord + " " + secondWord + " & " + thirdWord;
      } else if (randomNumber < 90) {
        stringToPush += '"'+ firstWord + ', ' + secondWord + ' & ' + thirdWord + '"';
      } else {
        stringToPush += firstWord + " & " + secondWord + " " + thirdWord;
      }
    }
    const createdAtDate = generateCreatedAt();
    resultObject[currentIndex] = stringToPush + "," + createdAtDate.toISOString() + "," + generateUpdatedAt(createdAtDate).toISOString()  + "\n";
  }
  for (let key in resultObject) {
    readable.push(resultObject[key]);
  }
  readable.push(null);
  console.log("Finished pushing data to categories.csv")
}

const createBooks = (number) => {
  let onePercent = number / 100;
  let currentChunk = 1;
  const readable = new Stream.Readable();

  if (TARGET_DATABASE === 'neo4j') {
    console.log("Writing books-neo4j.csv with " + number + " records.");
    readable.pipe(fs.createWriteStream('books-neo4j.csv'));
    readable.push("bookId:ID(Book),title,subtitle,author,narrator,imageUrl,audioSampleUrl,length,version,createdAt,updatedAt\n");
  } else {
    console.log("Writing books.csv with " + number + " records.");
    readable.pipe(fs.createWriteStream('books.csv'));
    readable.push("title,subtitle,author,narrator,imageUrl,audioSampleUrl,length,version,createdAt,updatedAt\n");
  }

  for (let i = 0; i < number; i++) {
    const createdAtDate = generateCreatedAt();
    const newBook = {
      title: capitalizeAllFirsts(faker.company.bs()) + ",",
      subtitle: capitalizeAllFirsts(faker.company.catchPhrase()) + ",",
      author: faker.name.findName() + ",",
      narrator: faker.name.findName() + ",",
      imageUrl: faker.image.imageUrl() + ",",
      audioSampleUrl: faker.internet.url() + ",",
      length: (getRandom(29) + 4) + ":" + getRandom(60) + ",",
      version: getRandom(100) < 85 ? "Unabridged Audiobook" + "," : "Abridged Audiobook" + ",",
      createdAt: createdAtDate.toISOString() + ",",
      updatedAt: generateUpdatedAt(createdAtDate).toISOString()
    }
    let stringToPush = "";
    if (TARGET_DATABASE === 'neo4j') {
      stringToPush += (i + 1) + ',';
    }
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

const createBooksCategories = (numberBooks) => {
  const numberCategories = 200;

  let onePercent = numberBooks / 100;
  let currentChunk = 1;
  const readable = new Stream.Readable();

  if (TARGET_DATABASE === 'neo4j') {
    console.log("Creating bookscategories-neo4j.csv with " + numberBooks + " records.");
    readable.pipe(fs.createWriteStream('bookscategories-neo4j.csv'));
    readable.push(":START_ID(Book), :END_ID(Category)\n");
  } else {
    console.log("Creating bookscategories.csv with " + numberBooks + " records.");
    readable.pipe(fs.createWriteStream('bookscategories.csv'));
    readable.push("bookId, categoryId\n");
  }

  const creationLoop = async () => {
    for (let i = 0; i < numberBooks; i++) {
      const firstCategory = getRandom(numberCategories) + 1;
      let secondCategory = 0;
      if ((getRandom(2) === 0 && firstCategory > 1) || firstCategory === 200) {
        secondCategory = getRandom(firstCategory - 1) + 1;
      } else {
        secondCategory = getRandom(numberCategories - firstCategory - 1) + firstCategory + 1;
      }
      readable.push((i + 1) + "," + (firstCategory) + "\n");
      readable.push((i + 1) + "," + (secondCategory) + "\n");
      if (i === currentChunk * onePercent) {
        console.log(currentChunk + "% complete.");
        currentChunk++;
        // Slowing down the writing a bit to avoid heap error that I don't understand
        await new Promise(resolve => {
          setTimeout(resolve, 500)
        });
      }
    }
    readable.push(null)
    console.log("Finished pushing data to bookscategories.csv");
  }
  creationLoop();
}

// createCategories(200);
createBooks(10000000);
// createBooksCategories(10000000);