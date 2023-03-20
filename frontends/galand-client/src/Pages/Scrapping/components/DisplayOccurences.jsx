import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function DisplayOccurences({ occurences, lang }) {
  console.log("ocurences", occurences)
  const { t } = useTranslation();
  if (!occurences.length) return null;
  return (
      <span className={"label margin-r-5 margin-b-10"}>{lang !== "ar" ? t("LABEL_SELECTED_FOR") + " : " : null}  {occurences.map((occ,i) => (
        <a className = "text-white" title={occ.newsTitle} key={occ.name + i}  href={"/news/" + occ.newsId}>
          {occ.name}
        </a>
      ))} {lang === "ar" ? " :  "+t("LABEL_SELECTED_FOR")  : null}</span>

  );
}

DisplayOccurences.defaultProps = {
  occurences: [],
};

DisplayOccurences.propTypes = {
  occurences: PropTypes.arrayOf(
    PropTypes.shape({
      newsId: PropTypes.string,
      type: PropTypes.string,
      newsTitle: PropTypes.string,
      name: PropTypes.string,
    })
  ),
};

export default DisplayOccurences;
