module.exports = (sequelize, Sequelize) => {

    const Profile = sequelize.define('profile', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        department: {
            type: Sequelize.STRING
        },
        avatarUrl: {
            type: Sequelize.STRING
        },
        about: {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false
    }
    );
    return Profile
};