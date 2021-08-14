const fs = require('fs');
const {Pool, Client} = require('pg');
const copyFrom = require('pg-copy-streams').from;
const progress = require('progress-stream');
require('dotenv').config();

const str = progress({
  length: 2300000000,
  time: 1000
});

str.on('progress', (progress) => {
  console.log(progress);
});

const pool = new Pool({
  host: process.env.REMOTE_DB_HOST,
  port: "5432",
  database: "audible",
  user: process.env.REMOTE_DB_USER,
  password: DB_PASSWORD,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client: ' + err);
  process.exit(-1);
});

const writeCSVToCategories = () => {
  return pool
    .query('CREATE TABLE IF NOT EXISTS "Categories" ("id" SERIAL PRIMARY KEY, "name" TEXT UNIQUE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL);')
    .then(() => console.log('Create "Categories" table successful.'))
    .then( () => {
      pool.connect((err, client, done) => {
        const writeStream = client.query(copyFrom('COPY "Categories" ("name", "createdAt", "updatedAt") FROM STDIN CSV HEADER'));
        const readStream = fs.createReadStream('categories.csv');
        readStream.on('error', (err) => {
          console.log('Error in Categories readStream: ' + err);
          done;
        });
        writeStream.on('error', (err) => {
          console.log('Error in Categories writeStream: ' + err);
          done;
        });
        writeStream.on('finish', () => {
          console.log('Categories writeStream finished.');
          done;
        });
        readStream.pipe(str).pipe(writeStream);
      });
    })
    .catch(err => console.log('Error creating "Categories" table: ' + err));
}

const writeCSVToBooks = () => {
  return pool
    .query('CREATE TABLE IF NOT EXISTS "Books" ("id" SERIAL PRIMARY KEY, "title" TEXT, "subtitle" TEXT, "author" TEXT, "narrator" TEXT, "imageUrl" TEXT, "audioSampleUrl" TEXT, "length" TEXT, "version" TEXT, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL);')
    .then(() => console.log('Create "Books" table successful.'))
    .then( () => {
      pool.connect((err, client, done) => {
        const writeStream = client.query(copyFrom('COPY "Books" ("title", "subtitle", "author", "narrator", "imageUrl", "audioSampleUrl", "length", "version", "createdAt", "updatedAt") FROM STDIN CSV HEADER'));
        const readStream = fs.createReadStream('books.csv');
        readStream.on('error', (err) => {
          console.log('Error in Books readStream: ' + err);
          done;
        });
        writeStream.on('error', (err) => {
          console.log('Error in Books writeStream: ' + err);
          done;
        });
        writeStream.on('finish', () => {
          console.log('Books writeStream finished.');
          done;
        });
        readStream.pipe(str).pipe(writeStream);
      });
    })
    .catch(err => console.log('Error creating "Categories" table: ' + err));
}

const writeCSVToBooksCategories = () => {
  return pool
    .query('CREATE TABLE IF NOT EXISTS "BooksCategories" ("bookId" INT NOT NULL, "categoryId" INT NOT NULL, CONSTRAINT "BooksCategories_pkey" PRIMARY KEY ("bookId", "categoryId"));')
    .then(() => console.log('Create "BooksCategories" table successful.'))
    .then(() => {
      pool.connect((err, client, done) => {
        const writeStream = client.query(copyFrom('COPY "BooksCategories" ("bookId", "categoryId") FROM STDIN CSV HEADER'));
        const readStream = fs.createReadStream('bookscategories.csv');
        readStream.on('error', (err) => {
          console.log('Error in BooksCategories readStream: ' + err);
          done;
        });
        writeStream.on('error', (err) => {
          console.log('Error in BooksCategories writeStream: ' + err);
          done;
        });
        writeStream.on('finish', () => {
          console.log('BooksCategories writeStream finished.');
          done;
        });
        readStream.pipe(str).pipe(writeStream);
      });
    })
    .catch(err => console.log('Error creating "BooksCategories" table: ' + err));
}

const dropTables = () => {
  return pool
    .query('DROP TABLE IF EXISTS "BooksCategories"')
    .then(res => console.log('"BooksCategories" table dropped.'))
    .then( () => {
      Promise.all([
        pool
          .query('DROP TABLE IF EXISTS "Books"')
          .then(res => console.log('"Books" table dropped.')),
        pool
          .query('DROP TABLE IF EXISTS "Categories"')
          .then(res => console.log('"Categories" table dropped.'))
      ])
    })
    .catch(err => console.log('Error dropping tables: ' + err));
}

const dropBooksCategories = () => {
  return pool
    .query('DROP TABLE IF EXISTS "BooksCategories"')
    .then(res => console.log('"BooksCategories" table dropped.'));
}

const runAQuery = () => {
  return pool
      .query('DROP TABLE IF EXISTS "Books"')
      .then(res => console.log('"Books" table dropped.'))
//    .query('SELECT * FROM "Books" JOIN "BooksCategories" ON "Books"."id" = "BooksCategories"."bookId" JOIN "Categories" ON "BooksCategories"."categoryId" = "Categories"."id" WHERE "Books"."author" = \'Andrew DuBuque\'')
//    .query('UPDATE "Books" SET "author" = \'Dr. Bridget Sipes\' WHERE "Books"."author" = \'Bridget Sipes\'')
      // .query('CREATE TABLE IF NOT EXISTS "Books" ("id" SERIAL PRIMARY KEY, "title" TEXT, "subtitle" TEXT, "author" TEXT, "narrator" TEXT, "imageUrl" TEXT, "audioSampleUrl" TEXT, "length" TEXT, "version" TEXT, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL);')
      //   .then(() => console.log('Create "Books" table successful.'))
      // .query('INSERT INTO "Books" ("title", "subtitle", "author", "narrator", "imageUrl", "audioSampleUrl", "length", "version", "createdAt", "updatedAt") VALUES (\'TestBook\', \'A book for testing.\', \'Testy McTestpherson\', \'Schenectady Jones\', \'www.fakeurl.com/test.png\', \'www.fakeurl.com/test.mp4\', \'22 hrs 5 minutes\', \'Unabridged Audiobook\', \'2015-01-01\', \'2020-06-01\')')
      //   .then(() => console.log('Insert successful.'))
      //   .then(res => console.log(res.rows));
}



// dropTables();
// writeCSVToCategories();
// writeCSVToBooks();
// dropBooksCategories()
//   .then(() => {
//      writeCSVToBooksCategories();
//   })
// runAQuery();

