import React, { useState } from "react";
import MyModal from "@shared/Components/MyModal";
import { Button } from "adminlte-2-react";

export default function DictionariesModal({
    text,
    dictionariesFilter,
    customDictionariesFilter,
    total_occurences,
}) {
    const [modalState, setModalState] = useState(false);
    //Return a table with the occurence of each word [{text:AA , value:2},{text:AA , value:4}]
    let searchEachOccurences = (text, dict) => {
        let wordsArray = text.split(/\s+/);
        let wordsMapArrayFormat = [];
        let wordsMap = {};
        wordsArray.forEach((word) => {
            let lowWord = word.toLowerCase().trim();
            wordsMap.hasOwnProperty(lowWord) ? wordsMap[lowWord]++ : (wordsMap[lowWord] = 1);
        });
        if (dict.words)
            Object.entries(wordsMap).forEach((entry) => {
                if (dict.words.includes(entry[0])) {
                    wordsMapArrayFormat.push({ text: entry[0], value: entry[1] });
                }
            });
        else if (dict.corpus) {
            let words = dict.corpus.split(/\s+/);
            Object.entries(wordsMap).forEach((entry) => {
                if (words.includes(entry[0])) {
                    wordsMapArrayFormat.push({ text: entry[0], value: entry[1] });
                }
            });
        }
        return wordsMapArrayFormat;
    };

    let filters = dictionariesFilter.concat(customDictionariesFilter);

    return (
        <div>
            <div style={{ float: "right", padding: "5px 0", width: "100%" }}>
                {filters &&
                    filters.map((dict) => (
                        <MyModal
                            hideSubmit={true}
                            block
                            onToggle={setModalState}
                            title={dict.name}
                            size={"lg"}
                            button={
                                <Button
                                    size={"xs"}
                                    icon={"fa-redo"}
                                    pullRight={true}
                                    type="warning"
                                    text={`${
                                        dict &&
                                        dict.name +
                                            " : " +
                                            (total_occurences[dict.name]
                                                ? total_occurences[dict.name]
                                                : 0)
                                    }`}
                                />
                            }
                        >
                            {modalState && (
                                <div style={{ minHeight: "500px !important" }}>
                                    {text &&
                                        dict &&
                                        searchEachOccurences(text, dict).map((el) => {
                                            console.log(el);
                                            return (
                                                <div
                                                    style={{
                                                        padding: "12px",
                                                        borderBottom: "1px solid  #e4e4e4",
                                                        width: "50%",
                                                        margin: "0 auto",
                                                    }}
                                                >
                                                    {el.text}
                                                    <span style={{ float: "right" }}>{el.value}</span>
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </MyModal>
                    ))}
            </div>
        </div>
    );
}

DictionariesModal.defaultProps = {
    total_occurences: {},
};
