import "react-app-polyfill/ie9";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { store } from "@shared/redux";
import LoadingScreen from "components/LoadingScreen";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const App = React.lazy(() => import("./App"));

ReactDOM.render(
  <Provider store={store}>
    <Suspense fallback={<LoadingScreen title="Loading" centerPage />}>
      <App />
    </Suspense>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
