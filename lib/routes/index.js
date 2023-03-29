import { apiRouter } from "./api.js";
import { nodeinfoRouter } from "./nodeinfo.js";
import {
  peopleRouter,
  getStatus,
  getPerson,
  getCollection,
  handlePOSTToCollection,
} from "./people.js";
import { wellKnownRouter } from "./wellknown.js";

export {
  apiRouter,
  nodeinfoRouter,
  peopleRouter,
  wellKnownRouter,
  getStatus,
  getPerson,
  getCollection,
  handlePOSTToCollection,
};
