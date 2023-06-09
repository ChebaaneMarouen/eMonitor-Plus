import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Col, Inputs } from "adminlte-2-react";
import { Form, Label } from "reactstrap";
import { CompactPicker } from "react-color";
import "../tags.css";
const { Text } = Inputs;
const colors = [
  "#CD5C5C",
  "#F08080",
  "#FA8072",
  "#E9967A",
  "#DC143C",
  "#FF0000",
  "#B22222",
  "#8B0000",
  "#FFC0CB",
  "#FFB6C1",
  "#FF69B4",
  "#FF1493",
  "#C71585",
  "#DB7093",
  "#FFA07A",
  "#FF7F50",
  "#FF6347",
  "#FF4500",
  "#FF8C00",
  "#FFA500",
  "#FFD700",
  "#FFFF00",
  "#FFFFE0",
  "#FFFACD",
  "#FAFAD2",
  "#FFEFD5",
  "#FFE4B5",
  "#FFDAB9",
  "#EEE8AA",
  "#F0E68C",
  "#BDB76B",
  "#d6e5fa",
  "#D8BFD8",
  "#DDA0DD",
  "#EE82EE",
  "#DA70D6",
  "#FF00FF",
  "#BA55D3",
  "#9370DB",
  "#663399",
  "#8A2BE2",
  "#9400D3",
  "#9932CC",
  "#8B008B",
  "#800080",
  "#4B0082",
  "#6A5ACD",
  "#483D8B",
  "#7B68EE",
  "#ADFF2F",
  "#7FFF00",
  "#7CFC00",
  "#00FF00",
  "#32CD32",
  "#98FB98",
  "#90EE90",
  "#00FA9A",
  "#00FF7F",
  "#3CB371",
  "#2E8B57",
  "#228B22",
  "#008000",
  "#006400",
  "#9ACD32",
  "#6B8E23",
  "#808000",
  "#556B2F",
  "#66CDAA",
  "#8FBC8B",
  "#20B2AA",
  "#008B8B",
  "#008080",
  "#00FFFF",
  "#E0FFFF",
  "#AFEEEE",
  "#7FFFD4",
  "#40E0D0",
  "#48D1CC",
  "#00CED1",
  "#5F9EA0",
  "#4682B4",
  "#B0C4DE",
  "#B0E0E6",
  "#ADD8E6",
  "#87CEEB",
  "#87CEFA",
  "#00BFFF",
  "#1E90FF",
  "#6495ED",
  "#4169E1",
  "#0000FF",
  "#0000CD",
  "#00008B",
  "#000080",
  "#191970",
  "#FFF8DC",
  "#FFEBCD",
  "#FFE4C4",
  "#FFDEAD",
  "#F5DEB3",
  "#DEB887",
  "#D2B48C",
  "#BC8F8F",
  "#F4A460",
  "#DAA520",
  "#B8860B",
  "#CD853F",
  "#D2691E",
  "#8B4513",
  "#A0522D",
  "#A52A2A",
  "#800000",
  "#FFE4E1",
  "#DCDCDC",
  "#D3D3D3",
  "#C0C0C0",
  "#A9A9A9",
  "#808080",
  "#696969",
  "#778899",
  "#708090",
  "#2F4F4F",
  "#16a085",
  "#1abc9c",
  "#8e44ad",
  "#9b59b6",
];
class TagsForm extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { t, item, onChange } = this.props;
    console.log(this.props, "tag");
    const { label, color } = item;
    return (
      <Form className={"form-horizontal"}>
        <Text
          onChange={onChange}
          name={"label"}
          labelClass={"required"}
          iconLeft={"fa-pen"}
          sm={8}
          labelSm={4}
          label={t("LABEL_LIBELLE") + ":"}
          placeholder={t("LABEL_LIBELLE")}
          value={label}
        />
        <Label sm={4} className={"control-label required"}>
          {t("LABEL_COULEUR")}:
        </Label>
        <Col sm={8} className={"children-margin-l"}>
          <CompactPicker
            color={color}
            colors={colors}
            name={"color"}
            onChangeComplete={(e) => {
              const { hex } = e;
              e = {
                target: {
                  value: hex,
                  name: "color",
                },
              };
              onChange(e);
            }}
          />
        </Col>
      </Form>
    );
  }
}
export default withTranslation()(TagsForm);
