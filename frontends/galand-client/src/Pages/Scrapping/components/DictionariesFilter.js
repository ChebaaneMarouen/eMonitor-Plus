import React from "react";
import Select from "components/Select";
import { Row, Col } from "adminlte-2-react";

export default function DictionariesFilter({
  dictionaries,
  customDictionaries,
  onChange,
  t,
  selecProjectDict,
  selecProjectCustDict
}) {
  var filteredDictionaries = [];
  var filteredCustDictionaries = [];

  if (Array.isArray(selecProjectDict)) {
    dictionaries.map(cd =>
      selecProjectDict.map(prjCd => {
        if (cd._id == prjCd) filteredDictionaries.push({ ...cd });
      })
    );
  } else filteredDictionaries = dictionaries;

  if (Array.isArray(selecProjectCustDict)) {
    customDictionaries.map(cd =>
      selecProjectCustDict.map(prjCd => {
        if (cd._id == prjCd) filteredCustDictionaries.push({ ...cd });
      })
    );
  } else filteredCustDictionaries = customDictionaries;

  return (
    <Row>
      <br />
      <Col sm={12}>
        <Select
          placeholder={t("LABEL_DICTIONAIRES")}
          label={t("LABEL_DICTIONAIRES")}
          iconLeft={"fab-searchengin"}
          name="dictionariesFilter"
          onChange={onChange}
          multiple={true}
          options={
            filteredDictionaries &&
            filteredDictionaries.map(m => ({
              label: m.name,
              value: { ...m }
            }))
          }
        />
      </Col>
      <br />

      <Col sm="12">
        <Select
          placeholder={t("LABEL_CUSTOM_DICTIONAIRES")}
          label={t("LABEL_CUSTOM_DICTIONAIRES")}
          iconLeft={"fab-searchengin"}
          name="customDictionariesFilter"
          onChange={onChange}
          multiple={true}
          options={
            filteredCustDictionaries &&
            filteredCustDictionaries.map(m => ({
              label: m.name,
              value: { ...m }
            }))
          }
        />
      </Col>
    </Row>
  );
}
