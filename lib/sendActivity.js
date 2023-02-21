import httpSignature from "http-signature";
import https from '@small-tech/https';
import { createHash } from "node:crypto";

/**
 * @typedef {import("express-serve-static-core").Request} Request
 * @typedef {import("node:http").RequestOptions} RequestOptions
 * @typedef {import("./Grouper.js").Grouper} Grouper
 * @typedef {import("./Activity.js").Activity} Activity
 * @typedef {import("./PeopleConnector.js").PersonRecord} PersonRecord
 */

/**
 *
 * @param {Activity} respondingActivity
 * @param {string} sendingKey
 * @param {PersonRecord} sendingActor
 * @param {Grouper} grouper
 */
export function sendActivity(respondingActivity, sendingKey, sendingActor, grouper) {
  const postData = JSON.stringify(respondingActivity);

  /** @type {RequestOptions} */
  const respondingRequestOptions = {
    host: respondingActivity.headerHostname,
    path: respondingActivity.headerUrl,
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    }
  };

  const respondingRequest = https.request(respondingRequestOptions, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  respondingRequest.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  const hash = createHash("sha256");
  hash.update(postData);
  const digest = "SHA-256=".concat(hash.digest("base64"));

  respondingRequest.setHeader("digest", digest);

  httpSignature.sign(respondingRequest, {
    key: sendingKey,
    keyId: sendingActor.id.concat("#main-key"),
    headers: [
      "(request-target)",
      "host",
      "date",
      "digest"
    ]
  });

  respondingActivity.headerSig = String(respondingRequest.getHeader("authorization") ?? "").substring("Signature ".length);

  respondingRequest.setHeader("signature", respondingActivity.headerSig);

  respondingRequest.write(postData);
  respondingRequest.end();


  grouper.addToGroup(sendingActor.preferredUsername.concat(".inbox"), respondingActivity);
  grouper.addToGroup(sendingActor.preferredUsername.concat(".statuses"), respondingActivity.object);
}
