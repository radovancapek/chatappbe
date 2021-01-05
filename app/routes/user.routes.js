module.exports = (app, io) => {
    const users = require("../controllers/user.controller.js");

    let router = require("express").Router();

    router.post("/", users.create);

    router.get("/", users.findAll);

    router.get("/:id", users.findOne);

    router.delete("/:id", users.delete);

    router.delete("/", users.deleteAll);

    app.use('/api/users', router);
};
