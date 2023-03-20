import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Button } from "adminlte-2-react";
import PropTypes from "prop-types";
import ViewSimilarNewsModal from "./ViewSimilarNewsModal";

class SubmitionConfirm extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const { t, cancelNewsCreation, similarNews, submitNews } = this.props;

    return (
      <div>
        <p>
          <span className="text-primary">
            {t("MESSAGE_NOMBRE_DES_ARTICLES_SIMILAIRE_EST_")}
            {": "}
            {similarNews.length}
          </span>
        </p>
        <br />
        <br />
        <Button
          type="success"
          text={t("BTN_SUBMIT_NEWS")}
          onClick={submitNews}
        />
        <ViewSimilarNewsModal submitNews={submitNews} />
        <Button
          className={"margin-r-5"}
          type="secondary"
          text={t("BTN_CANCEL")}
          onClick={cancelNewsCreation}
        />
      </div>
    );
  }
}

SubmitionConfirm.defaultProps = {
  similarNews: []
};

function mapStateToProps(state) {
  return {
    similarNews: state.data.similarNews
  };
}
export default withTranslation()(connect(mapStateToProps)(SubmitionConfirm));
