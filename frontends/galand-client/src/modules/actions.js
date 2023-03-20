const apiEndpoint = (process.env.REACT_APP_HOST.split(",")[0] || "") + "/api/manager/";
export function getCoverImage(url, cb) {
  fetch(apiEndpoint + "utilities/cover-image", {
    method: "POST",
    body: JSON.stringify({ url }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(cb)
    .catch(console.error);
}

export const makeNotifSeen = (idNotif, idNew , cb) => {
  fetch(apiEndpoint + "notifications/"+idNotif, {
    method: "PUT",
    body: JSON.stringify({ idNotif , idNew }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(res=> cb(res))
    .catch(console.error);
}

