const { Sequelize, DataTypes } = require('sequelize');
// require('dotenv').config();

const sequelize = new Sequelize('audible', 'carinij', 'mypassword', {
  host: 'localhost',
  dialect: 'postgres',
  // logging: false,
  pool: {
    max: 20,
    min: 0,
    acquire: 120000
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

// const Book_Category = sequelize.define('Book_Category', {
//   id: {
//     type: DataTypes.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   book_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: false,
//     unique: true,
//     references: {
//       model: Book,
//       key: 'id',
//     },
//     onDelete: 'cascade',
//     onUpdate: 'cascade',
//   },
//   category_id: {
//     type: DataTypes.INTEGER,
//     primaryKey: false,
//     unique: true,
//     references: {
//       model: Category,
//       key: 'id',
//     },
//     onDelete: 'cascade',
//     onUpdate: 'cascade',
//   }
// }, {
//   timestamps: false,
//   freezeTableName: true
// });

// Book.belongsToMany(Category, {
//   through: "Book_Category",
//   // as: 'categories',
//   // foreignKey: 'book_id'
// });

// Category.belongsToMany(Book, {
//   through: "Book_Category",
//   // as: 'books',
//   // foreignKey: 'category_id'
// });

sequelize.sync();

module.exports.sequelize = sequelize;
module.exports.Book = Book;
module.exports.Category = Category;
// module.exports.BookCategory = Book_Category;