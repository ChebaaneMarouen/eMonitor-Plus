import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';

export default function LoadOnScrollHOC(ListComponent, getData) {
  function Hook({ callback, isRequesting }) {
    useBottomScrollListener(() => {
      if (!isRequesting) callback();
    });
    return null;
  }

  return class LoadOnScroll extends Component {
    constructor(props) {
      super(props);
      this.state = {
        displayType: 6,
        filter: {},
        page: 0,
      };

      this.callback = () => {
        const { filter, page } = this.state;
        this.setState({
          page: page + 1,
        });
        getData(filter, page + 1, true);
      };
    }

    componentDidMount() {
      getData();
    }

    componentDidUpdate(prevProps) {
      const { filter } = this.props;
      if (prevProps.filter !== filter) {
        // eslint-disable-next-line
        this.setState({
          page: 0,
        });

        clearTimeout(this.tid);
        this.tid = setTimeout(() => {
          getData(filter, 0);
        }, 500);
      }
    }

    render() {
      const { isFetching } = this.props;
      return (
        <div>
          {/* eslint-disable-next-line */}
          <ListComponent {...this.props} />
          <Hook callback={this.callback} isRequesting={isFetching} />
        </div>
      );
    }
  };
}
