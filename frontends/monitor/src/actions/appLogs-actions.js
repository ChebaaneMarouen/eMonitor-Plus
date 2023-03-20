import { addTrailingSlash } from "../helpers/fix-url";

export function getDescriptions(hostname, cb) {
  return fetch(addTrailingSlash(hostname) + "app-logs/description", {
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(cb)
    .catch(console.error);
}
