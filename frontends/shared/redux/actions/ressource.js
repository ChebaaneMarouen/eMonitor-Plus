import _ from "lodash";
import { checkResponse, concatUrl } from "./utilities";
import { addAlert } from "./alerts";

const defaultOptions = { actions: {} };

function request(
  { body, isRequesting, requested, error, url, method, options = {} },
  dataType,
  alerts,
  cb
) {
  return (dispatch) => {
    dispatch({
      type: isRequesting,
      payload: { [dataType]: true },
    });
    let query = new URLSearchParams();
    Object.keys(options).forEach((key) => query.append(key, options[key]));
    query = query.toString();
    query = query ? `?${query}` : "";
    return fetch(url + query, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body,
    })
      .then(checkResponse)
      .then((res) => res.json())
      .then((res) => {
        if (typeof cb === "function") cb(null, res);
        const { append } = options;
        dispatch({
          type: requested,
          payload: { dataType, append, value: res },
        });
        // generate successMessage
        const message = alerts[`${requested}Success`](res, dataType);
        console.log("hahi msg", message)
        if (message) dispatch(addAlert({ message, type: "success" }));
        dispatch({
          type: isRequesting,
          payload: { [dataType]: false },
        });

        return res;
      })
      .catch(async (err) => {
        if (typeof cb === "function") cb(err);
 
        // if (err.status === 401) dispatch({ type: 'authLogin', isAuthenticated: false });
        dispatch({
          type: error,
          payload: err,
          error: true,
        });

        const { response } = err;

        // checking response header
        if (response && response.headers.get("content-type").indexOf("application/json") !== -1) {
          // eslint-disable-next-line
          err = await response.json();
          if (err.action === "disconnect user") dispatch({ type: 'authLogin', isAuthenticated: false });

        }
        // generate successMessage
        const message = alerts[`${requested}Error`](err, dataType);
        if (message) dispatch(addAlert({ message, type: "danger" }));
        dispatch({
          type: isRequesting,
          payload: { [dataType]: false },
        });
      });
  };
}
function search(url, dataType, data, ...args) {
  const cb = typeof args[args.length - 1] === "function" ? args[args.length - 1] : null;
  const options = typeof args[0] === "object" ? args[0] : {};
  return request(
    {
      isRequesting: "isFetching",
      requested: "fetch",
      error: "fetch",
      url: concatUrl(url, "search"),
      method: "POST",
      body: JSON.stringify(data),
      options,
    },
    dataType,
    this.alerts,
    cb
  );
}
function getOne(url, dataType, id, target, cb) {
  const newDataType = target || dataType;
  return request(
    {
      isRequesting: "isFetching",
      requested: "fetch",
      error: "fetch",
      url: concatUrl(url, id),
      method: "GET",
    },
    newDataType,
    this.alerts,
    cb
  );
}
function get(url, dataType, cb) {
  return request(
    {
      isRequesting: "isFetching",
      requested: "fetch",
      error: "fetch",
      url,
      method: "GET",
    },
    dataType,
    this.alerts,
    cb
  );
}
function insert(url, dataType, body, cb) {
  return request(
    {
      isRequesting: "isInserting",
      requested: "insert",
      error: "insertError",
      url,
      method: "POST",
      body: JSON.stringify(body),
    },
    dataType,
    this.alerts,
    cb
  );
}

function remove(url, dataType, data, cb) {
  return request(
    {
      isRequesting: "isRemoving",
      requested: "remove",
      error: "removeError",
      url: concatUrl(url, encodeURIComponent(data._id)),
      method: "DELETE",
    },
    dataType,
    this.alerts,
    cb
  );
}

function update(url, dataType, body, cb) {
  console.log("body update", JSON.stringify(body))
  console.log("body update", cb)
  return request(
    {
      isRequesting: "isUpdating",
      requested: "update",
      error: "updateError",
      url: concatUrl(url, encodeURIComponent(body._id)),
      method: "PUT",
      body: JSON.stringify(body),
    },
    dataType,
    this.alerts,
    cb
  );
}

function call({ baseUrl, url, path, method, headers, success, fail }, data) {
  // allow user to redefine URL
  let targetUrl = url || baseUrl;
  targetUrl = path ? concatUrl(targetUrl, path) : targetUrl;

  return (dispatch) =>
    fetch(targetUrl, {
      method: method || "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      body: data && JSON.stringify(data),
    })
      .then(checkResponse)
      .then((res) => res.json())
      .then((res) => {
        if (typeof success === "function") dispatch(success(res));
      })
      .catch(async (err) => {
        if (typeof fail === "function") {
          let { response } = err;

          // checking response header
          if (response && response.headers.get("content-type").indexOf("application/json") !== -1) {
            // eslint-disable-next-line
            response = await response.json();
          }
          dispatch(fail(response));
        }
      });
}

const defaultAlerts = {
  insertSuccess: (data, dataType) => `${dataType} a été créer`,
  updateSuccess: (data, dataType) => `${dataType} a été enregister`,
  fetchSuccess: () => "",
  removeSuccess: (data, dataType) => `${dataType} a été effacé`,
  insertError: (err) => `${err.message}`,
  updateError: (err) => `${err.message}`,
  fetchError: (err) => `${err.message}`,
  removeError: (err) => `${err.message}`,
};

export default function Ressource(url, dataType, options = {}) {
  this.alerts = { ...defaultAlerts, ...options.alerts };
  this.url = url;
  this.insert = insert.bind(this, url, dataType);
  this.update = update.bind(this, url, dataType);
  this.remove = remove.bind(this, url, dataType);
  this.get = get.bind(this, url, dataType);
  this.search = search.bind(this, url, dataType);
  this.getOne = getOne.bind(this, url, dataType);

  const { actions } = _.merge(defaultOptions, options);
  Object.keys(actions).forEach((key) => {
    const action = actions[key];
    this[key] = call.bind(this, { ...action, baseUrl: url });
  });
}
