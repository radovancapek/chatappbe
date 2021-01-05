module.exports = (sequelize, Sequelize) => {
    const Friendship = sequelize.define("friendship", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        who: {
            type: Sequelize.UUID
        },
        with: {
            type: Sequelize.UUID
        }
    });

    Friendship.associate = (models) => {
        models.user.belongsTo(models.user, {foreignKey: 'fk_who', targetKey: 'who', through: Friendship});
        models.user.belongsTo(models.user, {foreignKey: 'fk_with', targetKey: 'with', through: Friendship});
    }

    return Friendship;
};
