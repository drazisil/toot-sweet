/**
 *
 *
 * @author Drazi Crendraven
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next

 */
export async function bodyParser(request, response, next) {
  /** @type {string[]} */
  let bodyChunks = [];

  let body = "";

  const bodyPromise = new Promise((resolve, reject) => {
    request.on("data", (chunk) => {
      bodyChunks.push(chunk);
    });
    request.on("end", () => {
      body = bodyChunks.toString();
      resolve(body);
    });
    request.on("error", (err) => {
      reject(err);
    });
  });
  request.body = bodyPromise;
  next();
}
