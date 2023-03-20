import React from "react";
import PropTypes from "prop-types";
import { Table } from "reactstrap";

function ConfusionMatrix({ data, labels }) {
  return (
    <Table striped>
      <tbody>
        <tr>
          {[""].concat(labels).map((label, i) => (
            <td key={"label" + label}>
              <b>{label}</b>
            </td>
          ))}
        </tr>
        {data.map((row, i) => (
          <tr key={i}>
            <td>
              <b>{labels[i]}</b>
            </td>
            {row.map((col, j) => (
              <td
                key={"COL" + j}
                style={{
                  backgroundColor:
                    i === j ? "#d9f2bf" : col !== 0 ? "#ff787d" : ""
                }}
              >
                {col}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

ConfusionMatrix.defaultProps = {};

ConfusionMatrix.propTypes = {};

export default ConfusionMatrix;
