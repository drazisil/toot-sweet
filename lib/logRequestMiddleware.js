/**
 * @typedef {(request: import("express").Request, response: import("express").Response, next: import("express").NextFunction) => void} RequestMiddleware
 */
/**
 * Middleware to request method and url
 *
 * @author Drazi Crendraven
 * @returns {RequestMiddleware}
 */
export function logRequestMiddleware() {
    return (request, response, next) => {
        const { method, hostname, path, headers } = request;
        console.log(request.socket.remoteAddress, method, hostname, path, headers["accept"], headers["content-type"]);
        next();
    };
}