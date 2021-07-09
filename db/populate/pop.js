const fs = require('fs');
const {Pool, Client} = require('pg');
const copyFrom = require('pg-copy-streams').from;

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

pool
  .query('DROP TABLE IF EXISTS "Categories"')
  .then(res => console.log('"Categories" table dropped.'))
  .then( () => {
    return pool
      .query('CREATE TABLE IF NOT EXISTS "Categories" ("id" SERIAL PRIMARY KEY, "name" TEXT UNIQUE, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL);')
      .then(() => console.log('Create "Categories" table successful.'))
      .catch(err => console.log('Error creating "Categories" table: ' + err));
  })
  .then( () => {
    pool.connect( (err, client, done) => {
      const writeStream = client.query(copyFrom('COPY "Categories" (name, "createdAt", "updatedAt") FROM STDIN CSV HEADER'));
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
  .catch(err => console.log("Error caught: " + err));

  pool
  .query('DROP TABLE IF EXISTS "Books"')
  .then(res => console.log('"Books" table dropped.'))
  .then( () => {
    return pool
      .query('CREATE TABLE IF NOT EXISTS "Books" ("id" SERIAL PRIMARY KEY, "title" TEXT, "subtitle" TEXT, "author" TEXT, "narrator" TEXT, "imageUrl" TEXT, "audioSampleUrl" TEXT, "length" TEXT, "version" TEXT, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL);')
      .then(() => console.log('Create "Books" table successful.'))
      .catch(err => console.log('Error creating "Categories" table: ' + err));
  })
  .then( () => {
    pool.connect( (err, client, done) => {
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
  .catch(err => console.log("Error caught: " + err));