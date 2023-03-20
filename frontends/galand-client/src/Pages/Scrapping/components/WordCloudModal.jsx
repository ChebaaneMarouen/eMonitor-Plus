import React, { useState } from "react";
import ReactWordcloud from "react-wordcloud";
import MyModal from "@shared/Components/MyModal";
import { Button } from "adminlte-2-react";

export default function WordCloudModal({ text, stopWords }) {
    const [modalState, setModalState] = useState(false);
    //Return a table with the occurence of each word in a text [{text:AA , value:2},{text:AA , value:4}]
    let createWordMap = (texts) => {
        //if single text
        if (typeof texts == "string") {
            // split string by spaces, tabs and newlines
            let wordsArray = texts.split(/\s+/);
            let wordsMap = {};
            wordsArray.forEach((word) => {
                let lowWord = word.toLowerCase().trim();
                if (!stopWords.includes(lowWord))
                    wordsMap.hasOwnProperty(lowWord) ? wordsMap[lowWord]++ : (wordsMap[lowWord] = 1);
            });
            let wordsMapArrayFormat = [];
            Object.entries(wordsMap).forEach((entry) =>
                wordsMapArrayFormat.push({ text: entry[0], value: entry[1] })
            );
            return wordsMapArrayFormat;
        } else if (Array.isArray(texts)) {
            // if array of Strings
            let wordsArray = [];
            texts.map((txt) => {
                wordsArray.push(txt.split(/\s+/));
            });
            let wordsMap = {};
            wordsArray.flat().forEach((word) => {
                let lowWord = word.toLowerCase().trim();
                if (!stopWords.includes(lowWord))
                    wordsMap.hasOwnProperty(lowWord) ? wordsMap[lowWord]++ : (wordsMap[lowWord] = 1);
            });
            let wordsMapArrayFormat = [];
            Object.entries(wordsMap).forEach((entry) =>
                wordsMapArrayFormat.push({ text: entry[0], value: entry[1] })
            );
            return wordsMapArrayFormat;
        }
    };

    return (
        <div>
            {text && text.length != 0 && (
                <MyModal
                    hideSubmit={true}
                    block
                    title="Article Word Cloud"
                    size={"lg"}
                    onToggle={setModalState}
                    button={
                        <Button
                            size={"xs"}
                            icon={"fa-cloud"}
                            pullRight={true}
                            type="info"
                            text="Article Word Cloud"
                        />
                    }
                >
                    {modalState && (
                        <div style={{ minHeight: "500px !important" }}>
                            <ReactWordcloud
                                words={createWordMap(text)}
                                options={{ fontSizes: [10, 40] }}
                            />
                        </div>
                    )}
                </MyModal>
            )}
        </div>
    );
}
