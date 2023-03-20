import React, { Component } from "react";
import { Input } from "reactstrap";
import ReactTable from "react-table";

class LogsDataGrid extends Component {
  constructor(props) {
    super(props);
  }

  timeConverter(nano_timestamp) {
    var a = new Date(nano_timestamp * 1000);
    var hour = a.getHours();
    var min =
      a.getMinutes() < 10 ? "0" + String(a.getMinutes()) : a.getMinutes();
    var sec =
      a.getSeconds() < 10 ? "0" + String(a.getSeconds()) : a.getSeconds();
    var time = a.toLocaleDateString() + ", " + hour + ":" + min + ":" + sec;
    return time;
  }

  render() {
    const { data } = this.props;
    const columns = [
      {
        Header: "Time",
        accessor: "timeNano",
        width: 200,
        Cell: props => this.timeConverter(Number(props.original.time))
      },
      {
        Header: "Type",
        accessor: "Type",
        width: 100,
        filterable: true // String-based value accessors!
      },
      {
        Header: "Action",
        accessor: "Action",
        width: 100,
        filterable: true // String-based value accessors!
      },
      {
        Header: "Attributes",
        accessor: "Actor.Attributes",
        style: { overflowX: "auto" },
        filterable: true,
        filterMethod: (filter, row) => {
          const { value } = filter;
          const data = row[filter.id];
          for (let key of Object.keys(data)) {
            if (key.indexOf(value) >= 0) return true;
            if (String(data[key]).indexOf(value) >= 0) return true;
          }
          return false;
        },
        Cell: props => {
          return (
            <span className="d-flex align-items-start">
              {Object.keys(props.value).map(key => (
                <span key={key} style={{ margin: "5px" }}>
                  <span className="text-muted"> {key}= </span>
                  {props.value[key]}
                </span>
              ))}
            </span>
          );
        }
      }
    ];
    return (
      <ReactTable
        data={data}
        columns={columns}
        showPaginationTop={true}
        showPagination={true}
      />
    );
  }
}

LogsDataGrid.defaultProps = {
  data: [],
  monitored: []
};
export default LogsDataGrid;
