import React from "react";
import ReactDOM from "react-dom";
import "react-table/react-table.css";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import * as serviceWorker from "./serviceWorker";

document.addEventListener("DOMContentLoaded", function(event) {
  ReactDOM.render(<App />, document.getElementById("root"));
});
serviceWorker.unregister();
