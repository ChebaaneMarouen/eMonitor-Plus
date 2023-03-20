import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Select from "components/Select";
import { Feed, Medias, Dictionary } from "modules/ressources";
import {
  Inputs,
  Content,
  Row,
  Col,
  Box,
  Button,
  Tabs,
  TabContent,
  ButtonGroup
} from "adminlte-2-react";

import { Label, Form } from "reactstrap";
const { Text, Date } = Inputs;

class SearchTab extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.clear = this.clear.bind(this);

    this.getClearButton = this.getClearButton.bind(this);
  }
  onSubmit() {
    const { filterFeed } = this.props;
    filterFeed(this.state);
  }
  componentWillMount() {
    const { getMedias } = this.props;
    getMedias();
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }
  getClearButton(attr) {
    const val = this.state[attr];
    if (!val) return null;
    return (
      <Button
        type="danger"
        title="clear"
        icon="fa-trash"
        onClick={() => this.clear(attr)}
      />
    );
  }

  clear(attr) {
    this.setState({
      [attr]: undefined
    });
  }

  render() {
    const { medias, t } = this.props;
    // let sorted = medias.sort((x,y)=>y.name-x.name)
    // console.log("sorted", sorted)
    const {
      multi_source,
      multi_media,
      before_created,
      after_created,
      all_text
    } = this.state;
    return (
      <Box
        noPadding={true}
        collapsable={true}
        collapsed={true}
        title={t("TITLE_FILTRES_&_RECHERCHE")}
      >
        <Form className={"form-horizontal"} onSubmit={e => e.preventDefault()}>
          <Col xs={6}>
            <Select
              multiple={true}
              options={["facebook", "twitter", "website", "youtube", "facebook_mentions", "twitter_mentions"]}
              sm={8}
              labelSm={4}
              label={t("LABEL_SOURCE") + ":"}
              name="multi_source"
              value={multi_source}
              onChange={this.onChange}
              buttonRight={this.getClearButton("multi_source")}
            />
            <Select
              multiple={true}
              options={medias.map(m => ({ label: m.name, value: m._id }))}
              sm={8}
              labelSm={4}
              label={t("LABEL_MÉDIAS") + ":"}
              name="multi_media"
              onChange={this.onChange}
              value={multi_media}
            />
            <Date
              small={true}
              sm={12}
              labelSm={0}
              onChange={this.onChange}
              name="after_created"
              placeholder={t("LABEL_AJOUTER_APRÉS_LE")}
              value={after_created}
              buttonRight={this.getClearButton("after_created")}
            />
            <Date
              small={true}
              displayFormat={"MM/DD/YYYY"}
              placeholder={t("TEXT_AJOUTER_AVANT_LE")}
              sm={12}
              labelSm={0}
              name={"before_created"}
              onChange={this.onChange}
              value={before_created}
              buttonRight={this.getClearButton("before_created")}
            />
            <Text
              sm={8}
              name="all_text"
              onChange={this.onChange}
              labelSm={4}
              label={t("TEXT_RECHERCHE_TEXT")+":"}
              value={all_text}
            />
            <Button
              onClick={this.onSubmit}
              className="btn-block"
              icon={"fa-search"}
              type="success"
            />
          </Col>
        </Form>
        <Row />
      </Box>
    );
  }
}

SearchTab.propTypes = {
  className: PropTypes.string,
  medias: PropTypes.array,
  definedDictionaries: PropTypes.array
};

SearchTab.defaultProps = {
  medias: [],
  definedDictionaries: []
};

function mapStateToProps(state) {
  return {
    medias: state.data.medias
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getMedias: () => dispatch(Medias.get()),
    filterFeed: data => dispatch(Feed.search(data))
  };
}

export default withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SearchTab)
);
