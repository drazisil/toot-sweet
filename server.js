import { Grouper } from "./lib/Grouper.js";
import { PeopleConnector } from "./lib/PeopleConnector.js";
import {loadConfiguration} from "./lib/config.js";
import https from "@small-tech/https";
import { app } from "./lib/index.js";
import { Link } from "./lib/Link.js";
import log from "./lib/logger.js";



const config = loadConfiguration()

const options = {
    domains: [config.siteHost],
    settingsPath: "data",
  };

try {
    const grouper = Grouper.getGrouper();
  
    PeopleConnector.getPeopleConnector(config).addPerson("drazi");
  
    PeopleConnector.getPeopleConnector(config).addPerson("self");
  
    grouper.createGroup("activityStreamsInbound");
  
    grouper.createGroup("actorsSeen");
  
    grouper.createGroup("remoteActors");
  
    const server = https.createServer(options, app);
  
    grouper.createGroup("localHosts");
  
    config.localHosts.forEach((/** @type {string} */ entry) => {
      const host = new Link(entry, entry);
      host.id = entry;
      grouper.addToGroup("localHosts", host);
    });
  
    grouper.createGroup("blockedIPs");
  
    config.blockList.forEach((/** @type {string} */ entry) => {
      const host = new Link(entry, entry);
      host.id = entry;
      grouper.addToGroup("blockedIPs", host);
    });
  
    server.listen(443, () => {
      log.info(Object({ server: { status: "listening" } }));
    });
  
    server.on("error", (err) => {
      log.error(Object({ server: { status: "errored", reason: String(err) } }));
    });
  } catch (error) {
    console.error(error);
    log.error({ reason: `Fatal error!: ${String(error) }` });
    process.exit(-1);
  }
  