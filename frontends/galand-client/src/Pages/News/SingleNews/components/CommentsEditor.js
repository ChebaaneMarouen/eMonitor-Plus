import React, { useState, Fragment } from "react";
import TimeField from "react-simple-timefield";
import { Row, Col, Button, Inputs } from "adminlte-2-react";
const { Text } = Inputs;

export default function CommentsEditor({
    t,
    news,
    onSubmit,
    onChange,
    videoTrackComment,
    videoTrackTime,
    goToSpecificTime,
}) {
    let colonFormatTimeToSec = (time) => {
        let a = time.split(":");
        let seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
        console.log("GO TO (SEC) ", seconds);
        return seconds;
    };
    const commentsList = news.videoTrackComments.length ? (
        <Col style={{ maxHeight: "60vh", overflowY: "auto" }} sm={12}>
            {news.videoTrackComments
                .sort((a, b) => {
                    if (`${a.videoTrackTime}` === `${b.videoTrackTime}`) return 0;
                    if (`${a.videoTrackTime}` > `${b.videoTrackTime}`) return 1;
                    return -1;
                })
                .map((comment) => (
                    <div
                        style={{
                            padding: "15px",
                            borderBottom: "1px solid  #e4e4e4",
                            width: "100%",
                        }}
                    >
                        <div>
                            <Button
                                onClick={() => {
                                    goToSpecificTime(colonFormatTimeToSec(comment.videoTrackTime));
                                }}
                                text={comment.videoTrackTime}
                                size={"xs"}
                                type="info"
                            />

                            <span style={{ float: "right" }}>
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.target = {
                                            name: "removeVideoTrackTime",
                                            value: comment.videoTrackComment,
                                        };
                                        onSubmit(e);
                                    }}
                                    size={"xs"}
                                    icon={"fa-trash"}
                                    name={"removeVideoTrackTime"}
                                    value={comment.videoTrackComment}
                                    type="danger"
                                />
                            </span>
                        </div>

                        <div style={{ wordBreak: "break-all", padding: "4px" }}>
                            {comment.videoTrackComment}
                        </div>
                    </div>
                ))}
        </Col>
    ) : (
        <Fragment />
    );

    const addCommentInput = (
        <Col sm={12}>
            <Text
                onKeyPress={(e) => {
                    if (e.key === "Enter") onSubmit(e);
                }}
                onChange={onChange}
                name={"videoTrackComment"}
                value={videoTrackComment}
                label={
                    <TimeField
                        value={videoTrackTime}
                        onChange={onChange}
                        colon=":"
                        showSeconds={true}
                        name={"videoTrackTime"}
                        style={{
                            height: "34px",
                            width: "57px",
                        }}
                    />
                }
                iconLeft={"fa-pen"}
                placeholder={t("PLACEHOLDER_PRESS_COMMENT")}
            />
        </Col>
    );

    return (
        <Row>
            {addCommentInput}
            {commentsList}
        </Row>
    );
}
