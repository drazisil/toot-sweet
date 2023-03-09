"use strict";
exports.__esModule = true;
var config_js_1 = require("./lib/config.js");
var https_1 = require("@small-tech/https");
var logger_js_1 = require("./lib/logger.js");
var express_1 = require("express");
var wellknown_js_1 = require("./lib/routes/wellknown.js");
var people_js_1 = require("./lib/routes/people.js");
var api_js_1 = require("./lib/routes/api.js");
var admin_js_1 = require("./lib/routes/admin.js");
var nodeinfo_js_1 = require("./lib/routes/nodeinfo.js");
var helmet_1 = require("helmet");
var Grouper_js_1 = require("./lib/Grouper.js");
var logRequestMiddleware_js_1 = require("./lib/middleware/logRequestMiddleware.js");
var logActivities_js_1 = require("./lib/middleware/logActivities.js");
var notFoundHandler_js_1 = require("./lib/middleware/notFoundHandler.js");
var errorHandler_js_1 = require("./lib/middleware/errorHandler.js");
var requestLogger_js_1 = require("./lib/middleware/requestLogger.js");
var getBody_js_1 = require("./lib/getBody.js");
var ipCheckMiddleware_js_1 = require("./lib/middleware/ipCheckMiddleware.js");
var Link_js_1 = require("./lib/Link.js");
var app = (0, express_1["default"])();
var options = {
    domains: [config_js_1["default"]["SITE_HOST"]],
    settingsPath: "data"
};
app.disable("x-powered-by");
app.use(ipCheckMiddleware_js_1.ipCheckMiddleware);
app.use((0, helmet_1["default"])());
app.use(logRequestMiddleware_js_1.logRequestMiddleware);
app.use(getBody_js_1.getBody);
app.use(logActivities_js_1.logActivities);
app.use("/api", api_js_1["default"]);
app.use("/admin", admin_js_1["default"]);
app.use(requestLogger_js_1.requestLogger);
app.use("/.well-known", wellknown_js_1["default"]);
app.use("/nodeinfo", nodeinfo_js_1["default"]);
app.use("/people", people_js_1["default"]);
// This needs to redirect to /people
app.use("/users", people_js_1["default"]);
app.set("view engine", "ejs");
app.get("/", function (req, res) {
    res.render("index", { foo: "FOO" });
});
//  statis files
app.use(express_1["default"].static("./public"));
// custom 404
app.use(notFoundHandler_js_1.notFoundHandler);
// custom error handler
app.use(errorHandler_js_1.errorHandler);
try {
    var grouper_1 = Grouper_js_1.Grouper.getGrouper();
    grouper_1.createGroup("activityStreamsInbound");
    grouper_1.createGroup("actorsSeen");
    grouper_1.createGroup("remoteActors");
    var server = https_1["default"].createServer(options, app);
    grouper_1.createGroup("localHosts");
    config_js_1["default"]["LOCAL_HOSTS"].forEach(function (entry) {
        var host = new Link_js_1.Link(entry, entry);
        host.id = entry;
        grouper_1.addToGroup("localHosts", host);
    });
    grouper_1.createGroup("blockedIPs");
    config_js_1["default"]["BLOCKLIST"].forEach(function (entry) {
        var host = new Link_js_1.Link(entry, entry);
        host.id = entry;
        grouper_1.addToGroup("blockedIPs", host);
    });
    server.listen(443, function () {
        logger_js_1["default"].info(Object({ server: { status: "listening" } }));
    });
    server.on("error", function (err) {
        logger_js_1["default"].error(Object({ server: { status: "errored", reason: String(err) } }));
    });
}
catch (error) {
    console.error(error);
    logger_js_1["default"].error({ reason: "Fatal error!: ".concat({ error: String(error) }) });
    process.exit(-1);
}
