import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginMedia from "filepond-plugin-media-preview";

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond-plugin-media-preview/dist/filepond-plugin-media-preview.min.css';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginMedia);

// Our app
class Upload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      files: [],
    };
    this.onChange = this.onChange.bind(this);
  }

  handleInit() {}

  onChange() {
    const { name, onChange } = this.props;
    setTimeout(() => {
      const uploadedFiles = this.pond.getFiles().map((f) => ({
        serverId: f.serverId,
        filename: f.filename,
        fileType: f.fileType,
        fileSize: f.fileSize,
      }));
      // fix a weird bug
      if (uploadedFiles.every((f) => f.filename !== f.serverId)) onChange({ target: { name, value: uploadedFiles } });
    }, 25);
  }

  componentDidMount() {
    const { defaultValue } = this.props;
    this.setState({
      files: defaultValue.map((v) => ({
        source: v.serverId,
        filename: v.filename,
        options: { type: 'local', filename: v.filename },
      })),
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.defaultValue !== prevProps.defaultValue) {
      const { defaultValue } = this.props;
      this.setState({
        files: defaultValue.map((v) => ({
          source: v.serverId,
          filename: v.filename,
          options: { type: 'local', filename: v.filename },
        })),
      });
    }
  }

  render() {
    const {
      allowMultiple, maxFiles, server, className,
    } = this.props;
    return (
      <div className={className}>
        <FilePond
          ref={(ref) => (this.pond = ref)}
          files={this.state.files}
          allowMultiple={allowMultiple}
          maxFiles={maxFiles}
          server={{
            url: server,
            process: {
              onload: (file) => {
                console.log('onload', file.filename);
                this.onChange();
                return file;
              }
            },
          }}
          labelFileProcessingError={() => "Ce type de fichier n'est pas supporté"}
          oninit={() => this.handleInit()}
          allowRevert={true}
          onupdatefiles={(fileItems) => {
            this.setState({
              files: fileItems.map((fileItem) => fileItem.file),
            });
          }}
          onremovefile={this.onChange}
        />
      </div>
    );
  }
}

Upload.propTypes = {
  className: PropTypes.string,
  defaultValue: PropTypes.array,
  allowMultiple: PropTypes.bool,
  maxFiles: PropTypes.number,
  server: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

Upload.defaultProps = {
  defaultValue: [],
  className: '',
  allowMultiple: false,
  maxFiles: 10,
};

export default Upload;
