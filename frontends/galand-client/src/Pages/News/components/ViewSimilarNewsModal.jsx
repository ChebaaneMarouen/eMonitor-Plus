import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Button } from "adminlte-2-react";
import NewsList from "../NewsList/components/NewsList";
import MyModal from "@shared/Components/MyModal";

class ViewSimilarNewsModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t, submitNews, similarNews } = this.props;
    const top5News = similarNews.filter((_, i) => i < 5);
    return (
      <MyModal
        className={"inline"}
        button={
          <Button
            className={"margin-r-5"}
            type="warning"
            text={t("BTN_VIEW_SIMILAR_NEWS")}
          />
        }
        submitText={t("BTN_VALIDER_LAJOUT")}
        submitType={"warning"}
        submit={submitNews}
        title={t("TITLE_LIST_OF_SIMILAR_NEWS")}
      >
        <div>
          <NewsList news={top5News} />
        </div>
      </MyModal>
    );
  }
}

ViewSimilarNewsModal.defaultProps = {
  similarNews: []
};
function mapStateToProps(state) {
  return {
    similarNews: state.data.similarNews
  };
}
export default withTranslation()(
  connect(mapStateToProps)(ViewSimilarNewsModal)
);
