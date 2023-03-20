import React from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { coverImagesPath } from "modules/ressources";

function CoverImage({ news, t }) {
  if (!news) return null;
  const { title, coverImage, userCoverImage, link } = news;
  const userCover = userCoverImage && userCoverImage.length ? userCoverImage[0] : null;
  if (userCover && userCover.serverId)
    return (
      <center>
        <a href={news.link} target={"_blank"}>
          <img
            className="img-responsive"
            alt={title}
            src={coverImagesPath + "?load=" + userCover.serverId}
          />
        </a>
      </center>
    );
  if (coverImage)
    return (
      <center>
        <a href={link} target={"_blank"}>
          <img className="img-responsive" alt={title} src={coverImage} />
        </a>
      </center>
    );

  return (
    <h3 className={"text-center"}>
      <a href={link} target={"_blank"} style={{ fontSize: "17px" }}>
        {link || t("TEXT_NO_TITLE")}
      </a>
    </h3>
  );
}

CoverImage.defaultProps = {};

CoverImage.propTypes = {};

export default withTranslation()(CoverImage);
