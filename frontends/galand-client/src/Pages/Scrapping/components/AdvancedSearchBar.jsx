import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ClonableInputs from "@shared/ClonableInputs/ClonableInputs";
import QueryBuilder from "@shared/Components/QueryBuilder";

class AdvancedSearchBar extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.generateFilterQueryDescription = this.generateFilterQueryDescription.bind(
      this
    );
  }

  convertQueryToFilter(query, description) {
    const filter = {};
    query.forEach(q => {
      const operation = q.operation || description.operation.defaultValue;
      const key = q.key || description.key.defaultValue;
      const value = q.value || description.value.defaultValue;
      filter[operation + "_" + key] = value;
    });
    return filter;
  }
  convertFilterToQuery(filter) {
    const query = [];
    const keys = Object.keys(filter);
    keys.forEach(key => {
      console.log(key);
      const parts = key.split("_");
      const operation = parts.shift();
      console.log("PARTS", parts);
      query.push({
        operation,
        key: parts.join("_"),
        value: filter[key]
      });
    });
    console.log("QUERY CONVERTED ", query);
    return query;
  }

  generateFilterQueryDescription(description) {
    const { optionsFilter } = this.props;
    const filterQuery = {};
    filterQuery.key = {
      placeholder: "select attribute",
      defaultValue: "title",
      type: "select",
      options: [
        ...description
          .map(({ key }) => key)
          .filter(optionsFilter)
          //  if type is text then we should use key.keyword as filtering value
          .map(key => ({ label: key, value: key }))
      ]
    };

    filterQuery.operation = {
      placeholder: "Select an operation",
      type: "select",
      defaultValue: "like",
      options: [
        { label: "is Equal", value: "equal" },
        { label: ">=", value: "after" },
        { label: "<=", value: "before" },
        { label: "is Like", value: "like" }
      ]
    };
    filterQuery.value = {
      placeholder: "Value (If date yyyy-mm-dd)",
      defaultValue: "",
      type: "text"
    };
    return filterQuery;
  }
  onChange(e) {
    const { onChange, description } = this.props;
    const filter = this.convertQueryToFilter(
      e.target.value,
      this.generateFilterQueryDescription(description)
    );
    console.log(e.target.value);
    console.log(filter);
    onChange(filter, true);
  }

  render() {
    const { description, filter, t } = this.props;
    return (
      <ClonableInputs
        maxElements={10}
        minElements={0}
        initButtonText={t("BTN_ADD_ADVANCED_SEARCH")}
        value={this.convertFilterToQuery(filter)}
        name="filter"
        defaultValue={{ key: "title", operation: "like", value: "" }}
        onChange={this.onChange}
        className=" margin-b-15"
      >
        <QueryBuilder
          description={this.generateFilterQueryDescription(description)}
        />
      </ClonableInputs>
    );
  }
}

AdvancedSearchBar.propTypes = {
  className: PropTypes.string,
  description: PropTypes.array,
  filter: PropTypes.object,
  optionsFilter: PropTypes.func,
  onChange: PropTypes.func.isRequired
};

AdvancedSearchBar.defaultProps = {
  description: [],
  optionsFilter: () => true
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
  )(AdvancedSearchBar)
);
