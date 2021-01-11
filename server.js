const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const socket = require('socket.io')

let corsOptions = {
    origin: "http://localhost:3000"
};

const db = require("./app/models");
const Message = db.messages;
const Op = db.Sequelize.Op;
db.sequelize.sync().then(r => console.log("aaa"));

app.use(cors());

app.use(express.static('public'));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// simple route
app.get("/", (req, res) => {
    res.json({message: "Chat app backend"});
});


// set port, listen for requests
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const options = {
    cors: true,
    origins: ["http://127.0.0.1:3000"],
}

const io = socket(server, options);

require("./app/routes/message.routes")(app);
require("./app/routes/user.routes")(app, io);

io.on("connection", (socket) => {
    console.log("Made socket connection " + socket.id);

    socket.on("get_unread", (data) => {
        const to = data.to || 0;

        Message.findAll({
            where: {
                seen: false,
                to: data.to
            }
        }).then((_messages) => {
            let messages = {};
            _messages.forEach((message) => {
                messages[message.from] = (messages[message.from] || 0) + 1;
            })
            socket.emit("get_unread", messages);
        }).catch(reason => {
            console.log(reason);
        })
    })

    socket.on("set_seen", (data) => {
        Message.update(
            {
                seen: true
            },
            {
                where: {
                    from: data.from,
                    to: data.to
                }
            })
            .then(num => {
                socket.emit("set_seen", data);
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error updating Tutorial with id=" + id
                });
            });
    })

    socket.on("get_messages", (data) => {
        //console.log("get_messages " + data.from);
        const from = data.from || 0;
        const to = data.to || 0;

        Message.findAll({
            where: {
                [Op.or]: [
                    {
                        from: data.from,
                        to: data.to
                    },
                    {
                        from: data.to,
                        to: data.from
                    }
                ]
            }
        }).then((messages) => {
            socket.emit("get_messages", messages);
        }).catch(reason => {
            console.log(reason);
        })
    })

    socket.on("new_message", (message) => {
        Message.create(message).then(() => {
            socket.emit("new_message", message);
            socket.broadcast.emit("new_message", message);
        });
    })
});
