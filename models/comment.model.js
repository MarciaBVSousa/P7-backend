module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define('comment', {
        text: { type: Sequelize.STRING, allowNull: false },
    },
    {
        timestamps: true
    }
    );
    return Comment
};