import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import CronBuilderInput from "components/CronBuilderInput";
import Select from "components/Select";
import { Row, Col, Inputs } from "adminlte-2-react";
const { Text, ImportWrapper, Checkbox } = Inputs;

class MediaUrlForm extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { onChange, value } = this.props;
    const { name } = e.target;
    const itemValue = e.target.value;
    onChange({
      target: {
        value: {
          ...value,
          [name]: itemValue
        }
      }
    });
  }

  render() {
    const { buttonRight, mediaList, value, onChange, t } = this.props;
    return (
      <ImportWrapper labelSm={0} sm={12} buttonRight={buttonRight}>
        <Row>
          <Col sm={value.source === "facebook"?"3":"4"}>
            <Text
              iconLeft={"fa-link"}
              placeholder={t("LABEL_URL")}
              value={value.url}
              sm={12}
              labelSm={0}
              inputType="url"
              name="url"
              onChange={this.onChange}
            />
          </Col>
          <Col sm={value.source === "facebook"?"2":"3"}>
            <Select
              placeholder={t("LABEL_MEDIA_TYPE")}
              options={mediaList.map(t => ({
                label: t,
                value: t
              }))}
              sm={12}
              labelSm={0}
              name="source"
              value={value.source}
              onChange={this.onChange}
            />
          </Col>
          {value.source === "website" ? <Col sm="2">
            <Text
              placeholder={t("LABEL_PSEUDO_URL")}
              sm={12}
              labelSm={0}
              name="pseudoUrl"
              value={value.pseudoUrl}
              onChange={this.onChange}
            />
            </Col> : null}
            {value.source === "facebook" ? 
            <React.Fragment><Col sm="2">
            <Checkbox
              text={t("LABEL_CROWDTANGLE_URL")}
              sm={12}
              labelSm={0}
              name="crowdTangle"
              value={!!value.crowdTangle}
              onChange={() =>
                this.onChange({
                  target: { name: "crowdTangle", value: !value.crowdTangle }
                })
              }
            />
            </Col>
            <Col sm="2">
            <Checkbox
              text={t("LABEL_CROWDTANGLE_SEARCH")}
              sm={12}
              labelSm={0}
              name="search_crowdTangle"
              value={!!value.search_crowdTangle}
              onChange={() =>
                this.onChange({
                  target: { name: "search_crowdTangle", value: !value.search_crowdTangle }
                })
              }
            />
            </Col>
            </React.Fragment>: null}
          <Col sm="3">
            <CronBuilderInput
              placeholder={t("LABEL_SET_SCHEDULE")}
              name="schedule"
              value={value.schedule}
              onChange={this.onChange}
            />
          </Col>
        </Row>
      </ImportWrapper>
    );
  }
}

MediaUrlForm.propTypes = {
  mediaList: PropTypes.arrayOf(PropTypes.string).isRequired,
  t: PropTypes.func
};
MediaUrlForm.defaultProps = {
  t: String
};

export default withTranslation()(MediaUrlForm);
