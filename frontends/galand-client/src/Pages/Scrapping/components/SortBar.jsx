import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Box, Button, Col, Inputs } from "adminlte-2-react";
import { Form } from "reactstrap";
import Select from "components/Select";
import ClonableInputs from "@shared/ClonableInputs/ClonableInputs";
import QueryBuilder from "@shared/Components/QueryBuilder";

class SortBar extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  generateSortQueryDescription(description) {
    const sortQuery = {};
    sortQuery.key = {
      placeholder: "select attribute",
      type: "select",
      options: [
        ...description.map(des =>
          //  if type is text then we should use key.keyword as sorting value
          des.type === "text"
            ? { label: des.key, value: des.key + ".keyword" }
            : { label: des.key, value: des.key }
        )
      ]
    };

    sortQuery.order = {
      placeholder: "select order",
      type: "select",
      options: [
        { label: "descend", value: "desc" },
        { label: "ascend", value: "asc" }
      ]
    };
    return sortQuery;
  }

  render() {
    const { t, description, sort, onChange } = this.props;
    return (
      <ClonableInputs
        maxElements={4}
        minElements={1}
        initButtonText={t("BTN_ADD_SORT_FILTER")}
        value={sort}
        name="sort"
        defaultValue={{}}
        onChange={onChange}
      >
        <QueryBuilder
          description={this.generateSortQueryDescription(description)}
        />
      </ClonableInputs>
    );
  }
}

SortBar.propTypes = {
  className: PropTypes.string,
  description: PropTypes.array,
  sort: PropTypes.array.isRequired,
  onChange: PropTypes.func
};

SortBar.defaultProps = {
  description: []
};

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SortBar)
);
