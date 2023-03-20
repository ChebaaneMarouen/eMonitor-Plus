import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { MDBDataTable } from "mdbreact";

function ModelReport({ data }) {
  const { t } = useTranslation();
  const columns = [
    { label: "", field: "key" },
    { label: "Precision", field: "precision" },
    { label: "Recall", field: "recall" },
    { label: "F1-score", field: "f1-score" },
    { label: "Support", field: "support" }
  ];

  const rows = Object.keys(data)
    .filter(key => key !== "accuracy") // ignore accuracy in report
    .map(key => ({ ...data[key], key }));

  const tableData = { rows, columns };
  return (
    <MDBDataTable
      entriesLabel={t("TEXT_AFFICHER_LES_RÉSULTATS")}
      infoLabel={[
        t("TEXT_AFFICHAGE"),
        t("TEXT_DE"),
        t("TEXT_SUR"),
        t("TEXT_RESULTAT")
      ]}
      paginationLabel={[t("TEXT_PRECEDENT"), t("TEXT_SUIVANT")]}
      searchLabel={t("TEXT_RECHERCHE")}
      striped
      bordered
      displayEntries={false}
      hover
      data={tableData}
      responsive
      autoWidth
    />
  );
}

ModelReport.defaultProps = {
  data: {}
};

ModelReport.propTypes = {
  data: PropTypes.object
};

export default ModelReport;
