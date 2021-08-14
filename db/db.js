const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

console.log("DB_USER: " + process.env.DB_USER);
console.log("DB_HOST: " + process.env.DB_HOST);

const sequelize = new Sequelize('audible', process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: '5432',
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 30,
    min: 0,
    acquire: 150000,
    idle: 10000,
  }
})

sequelize.authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((err) => console.log(err));

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  narrator: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING
  },
  audioSampleUrl: {
    type: DataTypes.STRING
  },
  length: {
    type: DataTypes.STRING
  },
  version: {
    type: DataTypes.STRING
  },
});

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    unique: true
  }
});

const BooksCategories = sequelize.define('BooksCategories', {
  bookId: {
    type: DataTypes.INTEGER,
    primaryKey: false,
    references: {
      model: Book,
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  categoryId: {
    type: DataTypes.INTEGER,
    primaryKey: false,
    references: {
      model: Category,
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }
}, {
  timestamps: false,
  freezeTableName: true
});

Book.belongsToMany(Category, {
  through: "BooksCategories",
  as: 'categories',
  foreignKey: 'bookId'
});

Category.belongsToMany(Book, {
  through: "BooksCategories",
  as: 'books',
  foreignKey: 'categoryId'
});

sequelize.sync();

module.exports.sequelize = sequelize;
module.exports.Book = Book;
module.exports.Category = Category;
module.exports.BooksCategories = BooksCategories;