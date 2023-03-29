/**
 *
 * @param {import("express").Response} res
 * @param {string} [reason]
 */
export function json404(res, reason = "Not found") {
  res.statusCode = 404;
  res.setHeader("content-type", "application/json");
  res.json({
    code: 404,
    reason,
  });
  res.flushHeaders();
}
