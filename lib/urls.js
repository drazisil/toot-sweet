/**
 * Split a string on the forward slash, then return an array of the parts witj a forward slash prepended to each part
 * @param {string} rawPath
 * @returns {string[]}
 */
export function splitUrl(rawPath) {
  const parts = rawPath.split("/")
  parts.forEach((part, index) => {
    parts[index] = "/".concat(part)
  })
  return parts
}
