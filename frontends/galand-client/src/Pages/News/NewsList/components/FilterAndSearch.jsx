import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button, Col, Inputs } from "adminlte-2-react";
import { Form, Row } from "reactstrap";
import { ImpactEnum, NewsStateENum, PrioriteEnum } from "../../../../Enums";
import { Tags } from "modules/ressources";
import Select from "components/Select";
const { Text, DateTime } = Inputs;

class FilterAndSearch extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.clear = this.clear.bind(this);
    this.getClearButton = this.getClearButton.bind(this);
  }

  clear(attr) {
    const { onChange } = this.props;
    onChange({
      target: {
        name: [attr],
        value: undefined,
      },
    });
  }

  getClearButton(attr) {
    const val = this.props.filter[attr];
    if (!val) return null;
    return <Button type="danger" title="clear" icon="fa-trash" onClick={() => this.clear(attr)} />;
  }

  render() {
    const { t, filter, onChange } = this.props;
    console.log(filter);
    const {
      all_text,
      after_created,
      multi_impact,
      multi_subjects,
      multi_categories,
      multi_priority,
      before_created,
      multi_status,
    } = filter;
    const { definedTags, permissions } = this.props;
    return (
      <Form className={"form-horizontal"} onSubmit={this.submit}>
        <Row>
          <Col sm={6}>
            <Select
              placeholder={t("LABEL_FILTRER_PAR_PRIORITÉ")}
              iconLeft={"fa-exclamation"}
              name="multi_priority"
              onChange={onChange}
              sm={12}
              labelSm={0}
              multiple={true}
              value={multi_priority}
              options={Object.values(PrioriteEnum).map((v) => ({
                label: t(v.label),
                value: v.value,
              }))}
            />
            <DateTime
              iconLeft={"far-calendar"}
              small={true}
              timeFormat="HH:mm"
              sm={12}
              labelSm={0}
              onChange={(d) => {
                onChange({
                  target: { name: "after_created", value: d.valueOf() },
                });
              }}
              name="after_created"
              placeholder={t("LABEL_AJOUTER_APRÉS_LE")}
              value={after_created}
              buttonRight={this.getClearButton("after_created")}
              isDayBlocked={() => false}
              isOutsideRange={() => false}
            />
          </Col>
          <Col sm={6}>
            <Select
              placeholder={t("LABEL_FILTRER_PAR_IMPACT")}
              iconLeft={"fa-poll"}
              name="multi_impact"
              value={multi_impact}
              multiple={true}
              options={Object.values(ImpactEnum).map((v) => ({
                label: t(v.label),
                value: v.value,
              }))}
              sm={12}
              labelSm={0}
              onChange={onChange}
            />
            <DateTime
              iconLeft={"fas-calendar"}
              small={true}
              timeFormat="HH:mm"
              placeholder={t("LABEL_AJOUTER_AVANT_LE")}
              sm={12}
              labelSm={0}
              name={"before_created"}
              onChange={(d) => {
                onChange({
                  target: { name: "before_created", value: d.valueOf() },
                });
              }}
              value={before_created}
              buttonRight={this.getClearButton("before_created")}
            />
          </Col>

          <Col sm={6}>
            <Select
              placeholder={
                permissions["P_TAGS"] > 0 ? t("LABEL_FILTRER_PAR_SUJETS") : t("MISSING_TAGS_PERMISSION")
              }
              iconLeft={"fa-tags"}
              value={multi_subjects}
              name="multi_subjects"
              options={definedTags
                .filter((el) => el.isCategory == false)
                .map((t) => ({ label: t.label, value: t._id }))}
              multiple={true}
              sm={12}
              labelSm={0}
              onChange={onChange}
            />
          </Col>
          <Col sm={6}>
            <Select
              placeholder={
                permissions["P_TAGS"] > 0
                  ? t("LABEL_FILTRER_PAR_CATEGORY")
                  : t("MISSING_TAGS_PERMISSION")
              }
              iconLeft={"fa-tags"}
              value={multi_categories}
              name="multi_categories"
              options={definedTags
                .filter((el) => el.isCategory == true)
                .map((t) => ({ label: t.label, value: t._id }))}
              multiple={true}
              sm={12}
              labelSm={0}
              onChange={onChange}
            />
          </Col>
          <Col sm={12}>
            <Select
              placeholder={t("LABEL_FILTRER_PAR_ÉTAT")}
              iconLeft={"fa-list-alt"}
              onChange={onChange}
              name="multi_status"
              sm={12}
              multiple={true}
              labelSm={0}
              value={multi_status}
              options={Object.values(NewsStateENum)
                .filter((a) => typeof a === "object")
                .map((statusEnum) => ({
                  label: t(statusEnum.label),
                  value: statusEnum.value,
                }))}
            />
          </Col>
          <Col sm={12}>
            <Text
              value={all_text}
              name="all_text"
              onChange={onChange}
              placeholder={t("LABEL_RECHERCHER_UN_MOT")}
              sm={12}
              labelSm={0}
            />
          </Col>
        </Row>
      </Form>
    );
  }
}

FilterAndSearch.propTypes = {
  className: PropTypes.string,
  definedTags: PropTypes.array,
  filter: PropTypes.object,
};

FilterAndSearch.defaultProps = {
  definedTags: [],
  filter: {},
};

function mapStateToProps(state) {
  return {
    definedTags: state.data.tags,
    permissions: state.persistedData.permissions,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTags: () => dispatch(Tags.get()),
  };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(FilterAndSearch));
