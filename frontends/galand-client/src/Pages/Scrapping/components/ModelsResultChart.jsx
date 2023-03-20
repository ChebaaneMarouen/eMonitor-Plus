import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { PieChart } from "react-minimal-pie-chart";
import MyModal from "@shared/Components/MyModal";
import { Button } from "adminlte-2-react";

function getColor(i) {
  const colors = [
    "#E38627",
    "#C13C37",
    "#6A2135",
    "#f95d6a",
    "#003f5c",
    "#ff7c43",
    "#665191",
    "#d45087",
    "#2f4b7c",
    "#a05195",
    "#ffa600"
  ];
  return colors[i % colors.length];
}

function ModelsResultChart({ prediction }) {
  const { t } = useTranslation();

  let data = prediction
    .reduce((acc, v) => acc.concat(v), [])
    .reduce((acc, v) => {
      acc[v] = acc[v] ? acc[v] + 1 : 1;
      return acc;
    }, {});
  data = Object.keys(data).map((key, i) => ({
    title: key,
    value: data[key],
    color: getColor(i)
  }));
  const dominantClass = data.sort((a, b) => b.value - a.value)[0].title;
  return (
    <MyModal
      className={"inline"}
      button={
        <Button
          className={"margin-r-5"}
          size={"sm"}
          icon={"fa-zoom"}
          text={dominantClass}
          type="primary"
        />
      }
      submitText={t("BTN_HIDE")}
      submitType={"secondary"}
      submit={toggle => toggle()}
      title={t("TITLE_CLASSES_DISTRUBTION")}
    >
      <PieChart
        data={data}
        style={{ height: "320px" }}
        segmentsShift={index => 0.5}
        labelStyle={{
          fontSize: "5px",
          fontFamily: "sans-serif"
        }}
        label={({ dataEntry }) =>
          dataEntry.title + " " + Math.round(dataEntry.percentage) + "%"
        }
      />
    </MyModal>
  );
}

ModelsResultChart.defaultProps = {};

ModelsResultChart.propTypes = {};

export default ModelsResultChart;
