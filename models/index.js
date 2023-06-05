const dbConfig = require('../config/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    define: {
        freezeTableName: true
    },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model.js')(sequelize, Sequelize);
db.profile = require('./profile.model.js')(sequelize, Sequelize);
db.post = require('./post.model.js')(sequelize, Sequelize);
db.comment = require('./comment.model.js')(sequelize, Sequelize);


// associations
db.profile.hasOne(db.user,  {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

db.post.belongsTo(db.profile,  {
    onDelete: 'CASCADE',
});

db.comment.belongsTo(db.post,  {
    onDelete: 'CASCADE',
});

db.comment.belongsTo(db.profile,  {
    onDelete: 'CASCADE',
});


module.exports = db
