module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define("message", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        text: {
            type: Sequelize.STRING
        },
        from: {
            type: Sequelize.INTEGER
        },
        to: {
            type: Sequelize.INTEGER
        },
        seen: {
            type: Sequelize.BOOLEAN
        }
    });

    Message.associate = (models) => {
        models.message.belongsTo(models.user, {foreignKey: 'fk_from', targetKey: 'from'});
        models.message.belongsTo(models.user, {foreignKey: 'fk_to', targetKey: 'to'});
    }

    return Message;
};
