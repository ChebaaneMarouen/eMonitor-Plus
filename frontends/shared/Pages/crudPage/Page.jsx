import React, { Component, useEffect } from "react";
import { Content, Row, Col, Box } from "adminlte-2-react";
import "sweetalert/dist/sweetalert.css";
import PropTypes from "prop-types";
import List from "./components/ItemsList";
import AddModal from "./components/AddItemModal";
import { CSSTransition } from "react-transition-group";
import "./Page.css";

export default class CRUDPage extends Component{
  constructor(props){
    super(props)
  }
  componentDidMount(){
    const {initFunction} = this.props;
    if (typeof initFunction === "function") {
          initFunction();
        }
  }
  componentDidUpdate(prevProps){
    if(this.props.data !== prevProps.data){
      console.log("data in update shared", this.props.data)
    }
  }
  render(){
    const {title,
      browserTitle,
      
      data,
      columns,
      additionalActions,
      addTitle,
      Form,
      update,
      itemsCount,
      insert,
      remove,
      permission,
      page,
      printable,
      changeData,
      onChange,
      t,
      getCurrentPage,
      insertAdditionalValues,
      displayEntries,
      fromInfraction
    }=this.props;
  // ) {
  // useEffect(() => {
  //   if (typeof initFunction === "function") {
  //     initFunction();
  //   }
  // }, [initFunction, data]);
  console.log("from shared", data)
  return (
    <CSSTransition in={true} classNames="alert" timeout={600} unmountOnExit>
      <Content title={title} browserTitle={browserTitle}>
        <Box
          footer={
            permission >= 2 &&
            insert && (
              <AddModal
                t={t}
                insertAdditionalValues={insertAdditionalValues || null}
                onSubmit={insert}
                Form={Form}
                addTitle={addTitle}
              />
            )
          }
        >
          <List
            permission={permission}
            changeData={changeData}
            onChange={onChange}
            itemsCount={itemsCount}
            fromInfraction={fromInfraction}
            items={data}
            displayEntries={displayEntries}
            Form={Form}
            update={update}
            remove={remove}
            page={page}
            additionalActions={additionalActions}
            getCurrentPage={getCurrentPage}
            t={t}
            printable={printable}
            columns={columns}
          />
        </Box>
      </Content>
    </CSSTransition>
  );
}
}
CRUDPage.propTypes = {
  title: PropTypes.string.isRequired,
  browserTitle: PropTypes.string.isRequired,
  // eslint-disable-next-line
  data: PropTypes.array,
  // eslint-disable-next-line
  columns: PropTypes.array,
  additionalActions: PropTypes.array,
  t: PropTypes.func, // translation function
  insert: PropTypes.oneOfType([PropTypes.func, () => null]),
  update: PropTypes.oneOfType([PropTypes.func, () => null]),
  remove: PropTypes.oneOfType([PropTypes.func, () => null]),
  initFunction: PropTypes.oneOfType([PropTypes.func, () => null]),
};
CRUDPage.defaultProps = {
  data: [],
  columns: [],
  additionalActions: [],
  t: (text) => text,
  insert: null,
  update: null,
  remove: null,
  initFunction: null,
  permission: 0,
};
