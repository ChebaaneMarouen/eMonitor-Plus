import React, { useState, useEffect } from "react";
import MyModal from "@shared/Components/MyModal";
import CommentsEditor from "./CommentsEditor";
import { Row, Col, Button } from "adminlte-2-react";
import ReactPlayer from "react-player";

export default function VideoTracking({
    t,
    video_url,
    news,
    onSubmit,
    onChange,
    videoTrackComment,
    videoTrackTime,
}) {
    // let doc = new DOMParser().parseFromString(item.video_iframe, "text/html");
    const [player, setplayer] = useState();
    let goToSpecificTime = (sec) => {
        player.seekTo(parseInt(sec));
    };
    let ref = (player) => {
        setplayer(player);
    };
    let secondsToColonFormatTime = (sec) => {
        let date = new Date(0);
        date.setSeconds(sec);
        return date.toISOString().substr(11, 8);
    };
    return (
        <div>
            <MyModal
                button={
                    <Button
                        block={true}
                        pullRight={true}
                        icon={"fa-thumbtack"}
                        type="success"
                        text={t("VIDEO_TRACKING")}
                    />
                }
                title={t("VIDEO_TRACKING")}
                hideSubmit={true}
            >
                <Row>
                    <Col sm={12} md={5}>
                        <ReactPlayer
                            ref={ref}
                            url={video_url}
                            playing
                            controls={true}
                            width="100%"
                            height="69vh"
                            onProgress={(e) => {
                                e.target = {
                                    value: secondsToColonFormatTime(e.playedSeconds),
                                    name: "videoTrackTime",
                                };
                                console.log(e.target);
                                onChange(e);
                            }}
                        />
                        <br></br>
                    </Col>
                    <Col sm={12} md={7}>
                        <CommentsEditor
                            goToSpecificTime={goToSpecificTime}
                            t={t}
                            news={news}
                            onSubmit={onSubmit}
                            onChange={onChange}
                            videoTrackComment={videoTrackComment}
                            videoTrackTime={videoTrackTime}
                        />
                    </Col>
                </Row>
            </MyModal>
        </div>
    );
}
