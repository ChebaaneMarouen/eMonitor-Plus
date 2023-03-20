import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import CrudPage from "@shared/Pages/crudPage";
import { Videos } from "modules/ressources";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { processedVideoURL, googleSearchApi } from "config";
import _ from "lodash";

function mapStateToProps(state) {
    return {
        data: state.data.videos,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        remove: (video) => dispatch(Videos.remove(video)),
    };
}

const VideosCrudPage = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CrudPage));

class VideoPage extends Component {
    constructor(props) {
        super(props);
        this.progressions = ["Downloading Data", "Extracting Frames", "Video is Ready"];
    }

    getColumns(t) {
        return [
            {
                label: t("LABEL_URL"),
                field: "url",
            },
            {
                label: t("LABEL_PROGRESS"),
                field: "progressStr",
                getter: (video) => video.error || this.progressions[video.progression],
            },
            {
                label: t("LABEL_NOTE"),
                field: "note",
            },
            {
                label: t("LABEL_SEGMENTS"),
                field: "segments",
                getter: (video) => video.videoSegments.join(","),
            },
            {
                label: t("LABEL_ACTIONS"),
                field: "actions",
                sort: "disabled",
            },
        ];
    }
    doReverseSearches(images) {
        images
            .map((img) => processedVideoURL + img)
            .forEach((url) => {
                console.log(encodeURIComponent(url));
                window.open(googleSearchApi + encodeURIComponent(url));
                
            });
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <VideosCrudPage
                    title={t("TITLE_VIDEO_PREPROCESSING")}
                    browserTitle={t("TITLE_VIDEO_PREPROCESSING")}
                    columns={this.getColumns(t)}
                    t={t}
                    permission={this.props.permission}
                    additionalActions={[
                        (item) => (
                            <Link
                                className="btn margin-r-5  btn-primary btn-xs"
                                to={"/view-scrapping-list/" + encodeURIComponent(item.postId)}
                                title={t("BTN_VIEW")}
                            >
                                <FontAwesomeIcon icon={["fas", "eye"]} />
                            </Link>
                        ),
                        (item) =>
                            item.progression === 2 && (
                                <Button
                                    onClick={() => this.doReverseSearches(item.imagesPath)}
                                    color="success"
                                    size={"xs"}
                                >
                                    {t("BTN_REVERSE_SEARCH")}
                                </Button>
                            ),
                    ]}
                />
            </div>
        );
    }
}

export default withTranslation()(VideoPage);
