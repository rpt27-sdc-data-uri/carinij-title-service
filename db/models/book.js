const { Op } = require('sequelize');
const db = require('../db.js');

module.exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    db.Book.findOne({
      where: {
        id
      },
      include: 'categories'
    })
    .then (result => {
      resolve(result);
    })
    .catch(err => {
      reject(err);
    })
  });
};

module.exports.getByIds = (ids) => {
  return new Promise((resolve, reject) => {
    db.Book.findAll({
      where: {
        id: {
          [Op.or]: ids
        }
      },
      include: 'categories'
    })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.getRelatedById = (id) => {
  return new Promise((resolve, reject) => {
    const relatedBy = {
      byNarrator: [],
      byAuthor: []
    };
    let author = '';
    db.Book.findOne({
      where: {
        id
      }
    })
    .then((result) => {
      author = result.author;
      return db.Book.findAll({
        where: {
          [Op.and] : [
            {narrator: result.narrator},
            // Don't include results with the same author - only the same narrator
            {author: {[Op.not]: author}},
            // Don't include the original book
            {id: {[Op.not]: id}}
          ]
        },
        include: 'categories'
      });
    })
    .then((result) => {
      relatedBy.byNarrator = result;
      return db.Book.findAll({
        where: {
          [Op.and] : [
            {author: author},
            // Don't include the original book
            {id: {[Op.not]: id}}
          ]
        },
        include: 'categories'
      });
    })
    .then((result) => {
      relatedBy.byAuthor = result;
      resolve(relatedBy);
    })
    .catch((err) => {
      reject(err);
    })
  });
};

module.exports.createNewBook = (newBook) => {
  console.log("Creating new book.");
  console.log(newBook);
  return new Promise((resolve, reject) => {
    db.Book.create({
      title: newBook.title,
      subtitle: newBook.subtitle,
      author: newBook.author,
      narrator: newBook.narrator,
      imageUrl: newBook.imageUrl,
      audioSampleUrl: newBook.audioSampleUrl,
      length: newBook.length,
      version: newBook.version
    })
    .then (result => {
      resolve(result);
    })
    .catch(err => {
      reject(err);
    })

    // db.Category.findOrCreate({
    //   default: { category: newBook.category }
    // })
    // .then (result => {
    //   resolve(result);
    // })
    // .catch(err => {
    //   reject(err);
    // })

  });
};

module.exports.deleteById = (id) => {
  console.log("Deleting book at: " + id);
  return new Promise((resolve, reject) => {
    db.Book.destroy({
      where: {
        id: id
      }
    })
    .then (result => {
      resolve(result);
    })
    .catch(err => {
      reject(err);
    })
  });
};