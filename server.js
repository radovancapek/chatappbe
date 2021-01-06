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
db.sequelize.sync().then(r => console.log("aaa"));

app.use(cors());

app.use(express.static('public'));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Chat app backend" });
});



// set port, listen for requests
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const options={
    cors:true,
    origins:["http://127.0.0.1:3000"],
}

const io = socket(server, options);

require("./app/routes/message.routes")(app);
require("./app/routes/user.routes")(app, io);

io.on("connection", (socket) => {
    console.log("Made socket connection");

    socket.on("get_messages", (data) => {
        console.log("get_messages " + data.myId);
        if(data.myId == null) data.myId = 1;
        io.sockets.emit("new_message", {message: data.message});
        db.sequelize.query(
            'SELECT * FROM messages WHERE messages.from = :myid OR messages.to = :myid',
            { replacements: {myid: data.myId}, model: Message }).then(function(messages){
            socket.emit("get_messages", messages);
        }).catch(reason => {
            console.log(reason);
        })
    })

    socket.on("new_message", (message) => {
        console.log("message " + message.text);
        Message.create(message).then(() => {
            socket.emit("fetch_messages");
        });
    })

    socket.on("new_user", () => {

        console.log("new user event server");
        io.sockets.emit("new_user", {timestamp: Date.now()});
    })
});
