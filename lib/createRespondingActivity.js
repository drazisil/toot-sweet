import { Activity } from "toot-sweet/models";
import log from "./logger.js";
import { randomUUID } from "node:crypto";

/**
 *
 *
 * @author Drazi Crendraven
 * @param {URL} remoteActorInboxURL
 * @param {import("./models/Person.js").PersonRecord} person
 * @param {Activity} inboundActivity
 * @returns {Activity}
 */
export function createRespondingActivity(
  remoteActorInboxURL,
  person,
  inboundActivity
) {
  log.info({ remoteActorInboxHostname: remoteActorInboxURL.hostname });
  log.info({ remoteActorInboxPath: remoteActorInboxURL.pathname });

  const respondingActivity = new Activity();
  const respondingActivityID = randomUUID();
  // Message
  respondingActivity.object.id = person.id.concat(
    `/statuses/${respondingActivityID}`
  );
  respondingActivity.object.to = "https://www.w3.org/ns/activitystreams#Public";
  respondingActivity.object.cc = inboundActivity.actor.concat("/followers");
  respondingActivity.object.type = "Note";
  respondingActivity.object.inReplyTo = inboundActivity.object.id;
  respondingActivity.object.inReplyTo = inboundActivity.object.id;
  respondingActivity.object.content = `<p>Hi!</p>
  <p>This will probably look pretty bad. But I'm an auto-response to activity id: <a href="${inboundActivity.object.id}">${inboundActivity.object.id}</a></p>
  <p>This address is unmonitored...for now. :ablobcatwink:</p>`;
  // Activity
  respondingActivity.id = person.id.concat(
    `/statuses/${respondingActivityID}/activity`
  );
  respondingActivity.actor = person.id;
  respondingActivity.type = "Create";
  respondingActivity.to = inboundActivity.actor;
  // Activity Headers
  respondingActivity.headerHostname = remoteActorInboxURL.hostname;
  respondingActivity.headerMethod = "POST";
  respondingActivity.headerUrl = remoteActorInboxURL.pathname;

  return respondingActivity;
}
