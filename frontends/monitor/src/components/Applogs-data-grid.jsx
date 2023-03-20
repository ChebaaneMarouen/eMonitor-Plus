import React, { Component } from "react";
import ReactTable from "react-table";

class AppLogsDataGrid extends Component {
  render() {
    const { data } = this.props;
    const columns = [
      {
        Header: "Time",
        accessor: "time",
        width: 200,
        Cell: props => {
          console.log(props.original.time);
          return new Date(props.original.time)
            .toISOString()
            .replace("T", " ")
            .replace(/\..*/, "");
        }
      },
      {
        Header: "Origin",
        accessor: "origin",
        width: 200,
        filterable: true // String-based value accessors!
      },
      {
        Header: "ContainerId",
        accessor: "containerId",
        width: 200,
        filterable: true // String-based value accessors!
      },
      {
        Header: "Task",
        accessor: "task",
        width: 200,
        filterable: true // String-based value accessors!
      },
      {
        Header: "Level",
        accessor: "level",
        width: 100,
        filterable: true // String-based value accessors!
      },
      {
        Header: "Message",
        accessor: "text",
        width: 400,
        filterable: true // String-based value accessors!
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

AppLogsDataGrid.defaultProps = {
  data: []
};
export default AppLogsDataGrid;
