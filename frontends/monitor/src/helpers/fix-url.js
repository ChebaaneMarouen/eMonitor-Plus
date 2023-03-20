export function addTrailingSlash(url) {
  return url + (url[url.length - 1] === "/" ? "" : "/");
}
