import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Inputs } from "adminlte-2-react";
import { Form} from "reactstrap";
import { Tags } from "modules/ressources";
import { connect } from "react-redux";
import Select from "components/Select";

import "../tags.css";
const { Text } = Inputs;

class ConstituencyForm extends Component {
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
  getGovernoratOptions(t) {
    const { tags } = this.props;
    if(tags){
          const governorat = tags.filter(el=>el.isCategory === true );
      const data = governorat.map(el=> {
        return {label : el.label, value : el.label}
      })
      return data
    }

  }
  render() {
    const { t, item, onChange, tags } = this.props;
    console.log(tags, "tag");
    const { name, governorate } = item;

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
            placeholder={t("LABEL_CATEGORIES")}
            iconLeft={"fa-user-shield"}
            value={governorate}
            options={this.getGovernoratOptions(t)}
            multiple={false}
            allowClear={true}
            sm={8}
            labelSm={4}
            label={t("LABEL_CATEGORIES") + ":"}
            name="governorate"
            onChange={onChange}
          />
      </Form>
    );
  }
}
function mapStateToProps(state, ownProps) {
  return {
      tags : state.data.tags
  };
}
function mapDispatchToProps(dispatch) {
  return {
      initFunction: () => {
          dispatch(Tags.get());
      }   
}
}
export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ConstituencyForm)
);
