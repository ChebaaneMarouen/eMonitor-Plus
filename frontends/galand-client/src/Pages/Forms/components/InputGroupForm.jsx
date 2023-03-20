import React from "react";
import PropTypes from "prop-types";
import ClonableInputs from "@shared/ClonableInputs/ClonableInputs";
import { useTranslation } from "react-i18next";
import { Inputs } from "adminlte-2-react";
import Select from "components/Select";

const { Text } = Inputs;

function InputGroupForm({ value, onChange, className, buttonRight }) {
  console.log("VAKLLUE ", value);
  const onItemChange = ({ target }) => {
    const name = target.name;
    const itemValue = target.value;
    onChange({ target: { value: { ...value, [name]: itemValue } } });
  };

  const { t } = useTranslation();
  const { name, label, placeholder, options, inputType } = value;
  const selectOptions = ["select","checkbox","date","email","number","password","text","url","textarea"]
  return (
    <div className={className}>
      <Text
        onChange={onItemChange}
        name={"name"}
        sm={8}
        labelSm={4}
        label={t("LABEL_NAME") + ":"}
        placeholder={t("LABEL_NAME")}
        value={name || ""}
      />
      <Text
        onChange={onItemChange}
        name={"label"}
        sm={8}
        labelSm={4}
        label={t("LABEL_LABEL") + ":"}
        placeholder={t("LABEL_LABEL")}
        value={label || ""}
      />
      <Text
        onChange={onItemChange}
        name={"placeholder"}
        sm={8}
        labelSm={4}
        label={t("LABEL_PLACEHOLDER") + ":"}
        placeholder={t("LABEL_PLACEHOLDER")}
        value={placeholder || ""}
      />
       <Select
            onChange={onItemChange}
            placeholder={t("LABEL_TYPE")}
            label={t("LABEL_TYPE") + ":"}
            name="inputType"
            sm={8}
            labelSm={4}
            value={inputType || ""}
            options={selectOptions.map((v) => ({
                value: v,
                label: v
            }))}
        />
      {inputType === "select" ?
      <ClonableInputs
        maxElements={10}
        minElements={1}
        value={options}
        showDelete = {inputType === "select" }
        name="options"
        label={t("LABEL_OPTION")}
        defaultValue={""}
        from='form'
        onChange={onItemChange}
      >
        <Text
          name={"option"}
          sm={8}
          labelSm={4}
          label={t("LABEL_OPTION")}
          placeholder={t("LABEL_OPTION")}
        />
      </ClonableInputs>:
      null}
      <div className="menu">{buttonRight}</div>
    </div>
  );
}

InputGroupForm.defaultProps = {
  className: ""
};

InputGroupForm.propTypes = {
  className: PropTypes.string
};

export default InputGroupForm;
