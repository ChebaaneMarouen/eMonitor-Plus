import React, { Component } from "react";
import { Input } from "reactstrap";
import ReactTable from "react-table";
import "./status-data-grid.css";
import LogsButton from "./LogsButton";
import ActionButon from "./action-button.js";

class StatusDataGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    };
  }
  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    console.error(error);
    console.error(info);
  }
  static getDerivedStateFromError() {
    return { data: [] };
  }

  componentWillReceiveProps(nextProps) {
    const { data, monitored } = nextProps;
    this.setState({
      data: data.map(d => ({ ...d, monitored: monitored.indexOf(d.name) >= 0 }))
    });
  }

  render() {
    const { updateMonitored, getContainerLogs } = this.props;
    const columns = [
      {
        Header: "Service",
        accessor: "name",
        filterMethod: (filter, row) =>
          row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) !==
          -1,
        filterable: true // String-based value accessors!
      },
      {
        Header: "cpu%",
        accessor: "cpu%",
        Cell: props => props.value + "%"
      },
      {
        Header: "memory",
        accessor: "memoryRaw",
        Cell: props => props.original.memory || 0
      },
      {
        Header: "mem%",
        accessor: "mem%",
        Cell: props => props.value + "%"
      },
      {
        Header: "Network In",
        accessor: "networkInRaw",
        Cell: props => props.original.networkIn || 0
      },
      {
        Header: "Network Out",
        accessor: "networkOutRaw",
        Cell: props => props.original.networkOut || 0
      },
      {
        Header: "Disk In",
        accessor: "diskInRaw",
        Cell: props => props.original.diskIn || 0
      },
      {
        Header: "Disk Out",
        accessor: "diskOutRaw",
        Cell: props => props.original.diskOut || 0
      },
      {
        Header: "Status",
        filterable: true,
        accessor: "alive",
        Cell: props => {
          if (!props.value) return <span className="error">DOWN</span>;
          return <span className="success">UP</span>;
        }
      },
      {
        Header: "Inspect",
        accessor: "name",
        sortable: false,
        Cell: props => (
          <LogsButton
            containerId={props.value}
            getContainerLogs={getContainerLogs}
          />
        )
      },
      {
        Header: "Actions",
        accessor: "name",
        sortable: false,
        Cell: props => (
          <ActionButon
            action={this.props.action}
            status={props.original.alive}
            containerId={props.value}
          />
        )
      }
    ];
    return (
      <ReactTable
        data={this.state.data}
        indexKey={"name"}
        columns={columns}
        showPaginationTop={true}
        resizable={true}
        showPagination={true}
      />
    );
  }
}

StatusDataGrid.defaultProps = {
  monitored: []
};
export default StatusDataGrid;
