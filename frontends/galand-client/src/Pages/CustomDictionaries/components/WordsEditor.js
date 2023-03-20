import React, { useState } from "react";
import { Button, Inputs } from "adminlte-2-react";
const { Text } = Inputs;

export default function WordsEditor({ propWords, updateWords, t }) {
    const [word, setWord] = useState("");
    const [words, setWords] = useState(propWords);

    let addWord = () => {
        let newWords = words;
        let wordsArray = word.split(/\s+/);
        wordsArray.map((w) => {
            let lowWord = w.toLowerCase().trim();
            if (lowWord.length && !newWords.includes(lowWord)) {
                newWords.push(lowWord);
                setWord("");
                setWords(newWords);
                updateWords(words);
            }
        });
    };

    let enterPress = (e) => {
        if (e.key === "Enter") addWord();
    };

    let onChange = (e) => {
        if (!e.key || e.key === "Enter") setWord(e.target.value);
    };

    let removeWord = (word) => {
        let newWords = words;
        newWords.splice(newWords.indexOf(word), 1);
        setWords(newWords);
        updateWords(newWords);
    };

    const wordsList = words.length
        ? words
              .sort((a, b) => {
                  if (a === b) return 0;
                  if (a > b) return 1;
                  return -1;
              })
              .map((word) => (
                  <div
                      style={{
                          padding: "12px",
                          borderBottom: "1px solid  #e4e4e4",
                          width: "50%",
                          margin: "0 auto",
                      }}
                  >
                      {word}
                      <span style={{ float: "right" }}>
                          <Button
                              onClick={() => removeWord(word)}
                              size={"xs"}
                              icon={"fa-trash"}
                              type="danger"
                          />
                      </span>
                  </div>
              ))
        : [];

    const addWordInput = (
        <Text
            onKeyPress={enterPress}
            onChange={onChange}
            name={"name"}
            iconLeft={"fa-pen"}
            sm={8}
            labelSm={4}
            label={t("LABEL_WORDS") + ":"}
            placeholder={t("PLACEHOLDER_PRESS_WORD")}
            value={word}
        />
    );

    return (
        <div>
            {addWordInput}
            <div> {wordsList}</div>
        </div>
    );
}
