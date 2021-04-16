
const express = require("express");
const path = require("path");
const morgan = require("morgan")
const bodyParser = require("body-parser")
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
//app.engine('ejs', require("ejs").renderFile);
app.set('view engine', 'ejs');
 
app.get("/", (req, res) => {
    res.render("login")
})

let messeges = []

app.post("/chat",(req,res)=>{
    const {username} = req.body
    res.render("index",{username: username})
})

io.on('connection', socket => {
    console.log(socket.id);
    socket.emit("previousMessages", messeges)
    socket.on("sendMessege", data => {
        socket.broadcast.emit("receivedMessege", data)
        messeges.push(data)
    })
})

server.listen(8080);