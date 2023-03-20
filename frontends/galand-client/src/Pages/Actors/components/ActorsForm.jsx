import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Inputs } from "adminlte-2-react";
import { Form} from "reactstrap";
import { ConstituencyRessource} from "modules/ressources";
import { connect } from "react-redux";
import Select from "components/Select";

import "../tags.css";
const { Text } = Inputs;

class ActorsForm extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }
  componentDidMount(){
    const {initFunction} = this.props;
    initFunction()
  }
  getGenderOptions(t) {
    return [
      {
        label: t("TEXT_HOMME"),
        value: t("TEXT_HOMME")
      },
      {
        label: t("TEXT_FEMME"),
        value: t("TEXT_FEMME")
      },
      {
        label: t("TEXT_AUTRE"),
        value: t("TEXT_AUTRE")
      }
    ];
  }
  getActorTypeOptions(t) {
    return [
      {
        label: t("TEXT_INDEPENDENT"),
        value: t("TEXT_INDEPENDENT")
      },
      {
        label: t("TEXT_IN_PARTY"),
        value: t("TEXT_IN_PARTY")
      },
      {
        label: t("TEXT_AUTRE"),
        value: t("TEXT_AUTRE")
      }
    ];
  }
  getConstituencyOptions(t) {
    const { data } = this.props;
    if(data){
          const constituency = data.map(el=> {
        return {label : el.name, value : el.name}
      })
      return constituency
    }

  }
  render() {
    const { t, item, onChange } = this.props;
    console.log(this.props, "tag");
    const { name, sex, constituency, candidate_type } = item;
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
            placeholder={t("LABEL_GENDER")}
            iconLeft={"fa-user-shield"}
            value={sex}
            options={this.getGenderOptions(t)}
            multiple={false}
            allowClear={true}
            sm={8}
            labelSm={4}
            label={t("LABEL_GENDER") + ":"}
            name="sex"
            onChange={onChange}
          />
          <Select
            placeholder={t("LABEL_CONSTITUENCY")}
            iconLeft={"fa-user-shield"}
            value={constituency}
            options={this.getConstituencyOptions(t)}
            multiple={false}
            allowClear={true}
            sm={8}
            labelSm={4}
            label={t("LABEL_CONSTITUENCY") + ":"}
            name="constituency"
            onChange={onChange}
          />
          <Select
            placeholder={t("LABEL_CANDIDATE_TYPE")}
            iconLeft={"fa-user-shield"}
            value={candidate_type}
            options={this.getActorTypeOptions(t)}
            multiple={false}
            allowClear={true}
            sm={8}
            labelSm={4}
            label={t("LABEL_CANDIDATE_TYPE") + ":"}
            name="candidate_type"
            onChange={onChange}
          />
      </Form>
    );
  }
}
function mapStateToProps(state, ownProps) {
  return {
    data : state.data.constituencys,
  };
}
function mapDispatchToProps(dispatch) {
  return {
      initFunction: () => {
          dispatch(ConstituencyRessource.get());
      }   
}
}
export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ActorsForm)
);
