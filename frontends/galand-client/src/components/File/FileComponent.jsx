import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cliTruncate from 'cli-truncate';


class FileComponent extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const { file, staticPath } = this.props;

    return file ? (
      <div>
        <a
          className={"btn btn-default btn-dowload"}
          href={
            staticPath +
            "/" +
            encodeURIComponent(file.filename.replace(/\s/g, "_")) +
            "?load=" +
            file.serverId
          }
          target="_blank"
        >
          <FontAwesomeIcon icon={["fas", "download"]} /> {cliTruncate(file.filename,15)}
        </a>
      </div>
    ) : null;
  }
}

FileComponent.propTypes = {
  file: PropTypes.object,
  type: PropTypes.string
};

FileComponent.defaultProps = {
  file: {},
  type: "news"
};

export default FileComponent;
