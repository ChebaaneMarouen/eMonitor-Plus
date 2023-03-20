const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const controllers = require("./controllers");

const rabbit = require("@localPackages/rabbit");
const {rabbitMQ, rabbitQueues} = require("./config");
const {httpLogger} = require("./my_modules/logger");

// connect to rabbitMQ
rabbit
    .connect(rabbitMQ)
    .then(() => {
        console.log("[AMQP] Connected to rabbitMQ");
    })
    .catch(() => {
        console.log("[AMQP] Unable to connect to rabbitMQ");
    });

httpLogger.info("Server started");
// prevent caching of result
app.disable("etag");

app.use(cors());
app.use(
    morgan("[:date[clf]] " + "\":method :url \" :status :res[content-length]")
);

app.use(express.json());

app.use(cookieParser());

app.use("/", controllers.authentification);

app.use("/", controllers.monitoring);

app.use("/app-logs", controllers.appLogs);

app.get("/heartbeat", (req, res) => res.end("I'm alive"));

const eventHandler = controllers.eventController(io);
io.on("connection", function(client) {
    eventHandler.start(client);
});

const {saveData} = rabbitQueues;
rabbit.consume(saveData, controllers.logging.addLogs(io));

server.listen(80, () => console.log("Monitor started on 80"));
