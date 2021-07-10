const fs = require('fs');
const {Pool, Client} = require('pg');
const copyFrom = require('pg-copy-streams').from;
const progress = require('progress-stream');

const str = progress({
  length: 246978449,
  time: 1000
});

str.on('progress', (progress) => {
  console.log(progress);
});

const pool = new Pool({
  host: "localhost",
  database: "audible",
  user: "carinij",
  password: "mypassword",
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
        readStream.pipe(writeStream);
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
        readStream.pipe(writeStream);
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
    .query('SELECT * FROM "Books" JOIN "BooksCategories" ON "Books"."id" = "BooksCategories"."bookId" JOIN "Categories" ON "BooksCategories"."categoryId" = "Categories"."id" WHERE "BooksCategories"."bookId" = 9786345')
    .then(res => console.log(res.rows));
}


// dropTables();
// writeCSVToCategories();
// writeCSVToBooks();
// dropBooksCategories()
//   .then(() => {
//     writeCSVToBooksCategories();
//   })
runAQuery();

