const db = require("../models");
const Message = db.messages;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if (!req.body.text) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    const message = {
        text: req.body.text,
        from: req.body.from,
        to: req.body.to,
        seen: req.body.seen ? req.body.seen : false
    };

    Message.create(message)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    let condition = title ? {title: {[Op.iLike]: `%${title}%`}} : null;

    Message.findAll({where: condition})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving messages."
            });
        });
};

exports.findAllInChat = (req, res) => {
    if (req) {
        const fromParam = req.params.from;
        const toParam = req.params.to;
        Message.findAll({
            where: {
                from: fromParam,
                to: toParam
            }
        })
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving messages."
                });
            });
    }
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Message.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving message with id=" + id
            });
        });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {

};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Message.destroy({
        where: {id: id}
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Message was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete message with id=${id}. Maybe message was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete message with id=" + id
            });
        });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Message.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({message: `${nums} messages were deleted successfully!`});
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all messages."
            });
        });
};

// Find all published Tutorials
exports.findAllUnread = (req, res) => {
    Message.findAll({
        where: {
            seen: false
        }
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving messages."
            });
        });
};
