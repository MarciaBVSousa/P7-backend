require('dotenv').config();

module.exports = {
    HOST: "localhost",
    USER: process.env.USER,
    PASSWORD: process.env.PW,
    DB: "groupmania",
    //port: 5432,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
};