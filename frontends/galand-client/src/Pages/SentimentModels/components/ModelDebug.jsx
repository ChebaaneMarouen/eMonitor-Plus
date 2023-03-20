import React from "react";
import PropTypes from "prop-types";
import MyModal from "@shared/Components/MyModal";
import ModelReport from "./ModelReport";
import ConfusionMatrix from "./ConfusionMatrix";
import { useTranslation } from "react-i18next";
import { Tabs, TabContent, Button } from "adminlte-2-react";

function ModelDebug(props) {
  const { t } = useTranslation();
  const { data } = props;
  if (!data) return null;
  return (
    <MyModal
      button={
        <Button size="xs" icon="fa-search" type="info" text={t("BTN_DEBUG")} />
      }
      hideSubmit={true}
      title={t("TITLE_DEBUG_MODEL")}
      className="inline"
    >
      <Debug {...props} />
    </MyModal>
  );
}

function Debug({ data, info }) {
  const keys = Object.keys(data);
  // set defaultActive for the first element
  const defaultActiveKey = keys[0];
  const elements = keys.map(key => {
    if (key === "report") {
      //Render report
      return <ModelReport data={data[key]} />;
    }
    if (key == "accuracy")
      return (
        <p>
          <b>Accuracy: </b>
          {data[key]}%
        </p>
      );
    if (key == "confusion_matrix") {
      return <ConfusionMatrix data={data[key]} labels={info.labels} />;
    }
    return <Debug data={data[key]} info={info} />;
  });

  return (
    <Tabs defaultActiveKey={defaultActiveKey}>
      {elements.map((element, i) => (
        <TabContent title={keys[i]} eventKey={keys[i]}>
          {element}
        </TabContent>
      ))}
    </Tabs>
  );
}

ModelDebug.defaultProps = {
  data: null
};

ModelDebug.propTypes = {
  data: PropTypes.object
};

export default ModelDebug;
