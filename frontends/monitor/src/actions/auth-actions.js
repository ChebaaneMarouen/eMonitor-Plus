import { addTrailingSlash } from "../helpers/fix-url";

export function login(userName, password, hostname) {
  return fetch(addTrailingSlash(hostname) + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userName, password })
  })
    .then(res => res.json())
    .catch(console.error);
}
