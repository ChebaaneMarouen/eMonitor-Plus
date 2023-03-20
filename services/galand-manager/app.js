const requireAll = require("require-all");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const rabbit = require("@localPackages/rabbit");
const app = express();
const server = require("http").createServer(app);
const io = (module.exports.io = require("socket.io")(server));
const { addAction } = require("./services/userActionsService");
const { rabbitMQ, rabbitQueues } = require("./config");

// Controllers
const controllers = requireAll(__dirname + "/controllers");
const routers = requireAll(__dirname + "/routers");

// connect to rabbitMQ
rabbit
  .connect(rabbitMQ)
  .then(() => {
    console.log("[AMQP] Connected to rabbitMQ");
  })
  .catch((err) => {
    console.log(err);
    console.log("[AMQP] Unable to connect to rabbitMQ");
  });

app.use(
  cors({
    credentials: true,
  })
);

// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "50mb",
  })
);

// parse application/json
app.use(bodyParser.json({ limit: "50mb" }));
app.use(morgan("combined"));
app.use(cookieParser());

const eventHandler = controllers.eventController(io);
const {
  receivedUserData,
  userDataUpdated,
  userNotificationSuccess,
  userNotificationError,
  publishedSettings,
} = rabbitQueues;

rabbit.consume(publishedSettings, eventHandler.receiveSettings);
rabbit.consume(receivedUserData, eventHandler.receiveUserData);

rabbit.consume(userDataUpdated, eventHandler.updateAppData);
rabbit.consume(userNotificationSuccess, eventHandler.notification("success"));
rabbit.consume(userNotificationError, eventHandler.notification("error"));

io.on("connection", function (client) {
  eventHandler.start(client);

  client.on("disconnect", function () {
    // stop server from quering update information
  });
});

// static server for serving translations
app.use("/assets", express.static("public"));

// REST API
app.use("/auth", routers.authRouter);
app.use("/public/news", controllers.publicNewsController);
app.use("/static", bodyParser.text(), routers.staticRouter);
app.use("/", controllers.securityController.verifyCookie);
app.use("*", addAction);
app.use("/similar-news", routers.similarNewsRouter);
app.use("/stats", routers.statsRouter);
app.use("/utilities", routers.utilitiesRouter);
app.use("/news", routers.newsRouter);
// app.use('/monitor', controllers.securityController.isMonitor);
app.use("/custom-search", routers.customSearchRouter);
app.use("/feed", routers.feedRouter);
// app.use('/super-monitor', controllers.securityController.isSuperMonitor);
app.use("/monitors", controllers.monitorsController);
app.use("/projects", routers.projectsRouter);
// app.use('/admin', controllers.securityController.isAdmin);
app.use("/settings", controllers.settingsController);
app.use("/users", routers.userRouter);
app.use("/dictionaries", routers.dictionariesRouter);
app.use("/custom-dictionaries", routers.customDictionariesRouter);
app.use("/videos", routers.videosRouter);
app.use("/models", routers.modelsRouter);
app.use("/tags", routers.tagsRouter);
app.use("/rules", routers.rulesRouter);
app.use("/data/", routers.presenterRouter);
app.use("/media", routers.mediaRouters);
app.use("/roles", routers.rolesRouters);
app.use("/classification", routers.crudRouter("Classification", "P_CLASSIFICATION"));
app.use("/sentiment", routers.crudRouter("Sentiments", "P_CLASSIFICATION"));
app.use("/form", routers.crudRouter("Form", "P_FORM"));
app.use("/actor", routers.crudRouter("Actor", "P_TAGS"));
app.use("/party", routers.crudRouter("Party", "P_TAGS"));
app.use("/civil", routers.crudRouter("Civil", "P_TAGS"));
app.use("/constituency", routers.crudRouter("Constituency", "P_TAGS"));
app.use("/optimize", routers.optimizeRouter);
app.use("/notifications", routers.notificationRouter);
app.get("/heartbeat", (req, res) => res.end("I''m alive"));
app.post("/comment-analyse", controllers.commentsController.analyseComment);
app.post("/detoxify-analyse", controllers.commentsController.analyseDetoxify);

server.listen(80, () => {
  console.log("Manager Service Started 80");
});
