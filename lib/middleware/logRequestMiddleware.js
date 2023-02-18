/**
 * @typedef {import("express-serve-static-core").Request} Request
 * @typedef {import("express-serve-static-core").Response} Response
 * @typedef {import("express-serve-static-core").NextFunction} NextFunction
 */

/**
 * Middleware to request method and url
 *
 * @author Drazi Crendraven
 * @export
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} next
 */
export function logRequestMiddleware(request, response, next) {

        const { method, hostname, path, headers } = request;
        console.log(request.socket.remoteAddress, method, hostname, path, headers["accept"], headers["content-type"]);
        next();
}
