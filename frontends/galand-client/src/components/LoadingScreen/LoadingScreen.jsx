import React from "react";
import PropTypes from "prop-types";
import loading from "assests/loading-screen.gif";
import "./LoadingScreen.css";
import Spinner from "components/Spinner/Spinner";

function LoadingScreen({ title, centerPage }) {
  const classNames = ["text-center"];
  if (centerPage) classNames.push("centerPage");
  return (
    <div className={classNames.join(" ")}>
      <h4 className="text-primary">{title}</h4>

      {/* <img
        className="img img-responsive"
        src={loading}
        style={{ margin: "auto", maxWidth: "150px" }}
        alt="Loading Screen"
      /> */}
      <Spinner/>
    </div>
  );
}

LoadingScreen.defaultProps = {
  title: PropTypes.string
};

LoadingScreen.propTypes = {
  title: PropTypes.string
};

export default LoadingScreen;
