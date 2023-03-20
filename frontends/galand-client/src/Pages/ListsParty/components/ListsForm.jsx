import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Inputs } from "adminlte-2-react";
import { Form} from "reactstrap";
import Select from "components/Select";
import { connect } from "react-redux";

import "../tags.css";
import { ActorRessource } from "modules/ressources";
const { Text } = Inputs;

class PartyListForm extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    const {getActors} = this.props;
      getActors();
  }
  render() {
    const { t, item, onChange, actors } = this.props;
    const { name, political_actor } = item;
    return (
      <Form className={"form-horizontal"}>
        <Text
          onChange={onChange}
          name={"name"}
          labelClass={"required"}
          iconLeft={"fa-pen"}
          sm={8}
          labelSm={4}
          label={t("LABEL_NAME") + ":"}
          placeholder={t("LABEL_NAME")}
          value={name}
        />
        <Select
            name="political_actor"
            placeholder={t("LABEL_POLITICAL_ACTOR")}
            iconLeft={"fa-tags"}
            multiple={true}
            value={political_actor}
            options={actors.map(actor=> ({
              label: actor.name,
              value: actor.name,
            }))}
            sm={8}
            labelSm={4}
            label={t("LABEL_POLITICAL_ACTOR") }
            onChange={onChange}
          /> 
      </Form>
    );
  }
}
PartyListForm.defaultProps = {
  actors : []
};
function mapDispatchToProps(dispatch) {
  return {
    getActors: () => {
      dispatch(ActorRessource.get());
  }
  };
}
function mapStateToProps(state) {
  return {
      actors : state.data.actors,
  };
}
export default withTranslation()(
  connect(
  mapStateToProps,
  mapDispatchToProps
)(PartyListForm));
