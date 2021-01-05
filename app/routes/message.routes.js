module.exports = app => {
    const messages = require("../controllers/message.controller.js");

    let router = require("express").Router();

    router.post("/", messages.create);

    router.get("/", messages.findAll);

    //router.get("/:from:to", messages.findAllInChat());

    router.get("/:id", messages.findOne);

    //router.put("/:id", tutorials.update);

    router.delete("/:id", messages.delete);

    router.delete("/", messages.deleteAll);

    app.use('/api/messages', router);
};
