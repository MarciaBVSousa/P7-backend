module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define('post', {
        text: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING
        },

        seenBy: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue: []
            //allowNull: false
        }
    },
    {
        timestamps: true
        // updatedAt: false
    }
    );
    return Post
};