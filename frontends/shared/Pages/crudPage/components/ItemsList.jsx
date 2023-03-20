import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { MDBDataTable } from "mdbreact";
import { Button, Inputs} from "adminlte-2-react";
const { DateTime } = Inputs;
import ReactPaginate from "react-paginate";
import RemoveItemModal from "./RemoveItemModal";
import UpdateItemModal from "./UpdateItemModal";
import exportFromJSON from 'export-from-json';
import { connect } from "react-redux";
import {User, Role} from "modules/ressources";

const exportType = 'xls' 

class ItemsList extends Component {
  constructor(props) {
    super(props);
    this.createActions = this.createActions.bind(this);
  }

  createActions(item) {
    const { additionalActions, Form, update, t, remove, permission } = this.props;
    if (permission >= 2) {
      return [
        additionalActions.map((el) => el(item, this.props)),
        update && <UpdateItemModal t={t} onSubmit={update} Form={Form} key={item._id} item={item} />,
        remove && <RemoveItemModal t={t} key={`${item._id}REMOVE`} onSubmit={remove} item={item} />,
      ];
    }
  }
  componentWillMount() {
    const {getUsers, getRoles} = this.props;

    getUsers();
    getRoles();
  }
  ExportToExcel = (data, fields) => {  
    const {tags, medias, t, users, roles} = this.props;  
    console.log("data", data)
    console.log("fields", fields)
    let newData = data.map(el=>{
      let picked =_.pick(el,fields)
      return picked
    })

    const translatedData = newData.map(element=>{
      console.log("titles", element)
      let user = users.filter(el=>el.fName + " " + el.lName === element.creatorInfo);
      let role = user[0] ? roles.filter(el=>el._id === user[0].role) :[];
      let roleName =role[0]? role[0].name:"";
      const proof = element.files ? element.files.map(el=>el.props.staticPath+ "/" + el.props.file.filename + "?load="+el.props.file.serverId) : [];
      return element.title ?({
      "إسم الراصد" : element.creatorInfo,
      "فريق العمل" : roleName,
      "عنوان": element.title.props.children,
      "الحالة": element.infractionStatus.props.children,
      "النوع" : element.infractionType,
      "تعليق" : element.infractionComment,
      "تاريخ المخالفة": element.infraction_date,
      "تاريخ الإنشاء": element.createdAt,
      "الجهة المسؤولة" : element.responsible,
      "نوع الجهة المسؤولة" : element.responsibleType,
      "المرشح" : element.candidate,
      "نوع المرشح" : element.candidate_type,
      "الهيئة الفرعية" :  element.irie,
      "إثبات" : proof.join(", ") ,
      "رابط" : element.link.props.children,
      "تعليق التأكيد" : element.confirmComment
      }):{}
    })
          console.log("newData", newData)
    exportFromJSON({ data : translatedData , fileName : "table-" + Date.now(), exportType })  
  }  
  clear(attr) {
    const { onChange } = this.props;
    onChange({
      target: {
        name: [attr],
        value: undefined,
      },
    });
  }
  getClearButton(attr) {
    const val = this.props.filter[attr];
    if (!val) return null;
    return <Button type="danger" title="clear" icon="fa-trash" onClick={() => this.clear(attr)} />;
  }

  render() {
    let { items } = this.props;
    let dataExport = items;
    console.log("items \t", items)
    const {
      columns,
      t,
      permission,
      getCurrentPage,
      displayEntries = true,
      itemsCount,
      changeData,
      page,
      lang,
      fromInfraction,
      permissions,
      after,
      before,
      onChange
    } = this.props;
    console.log("from infr", fromInfraction)
    if (lang == "ar") columns.reverse();
    let fields = columns.map((c) => c.field);
    items = items
      ? items
          .map((item) => {
            const newItem = { ...item };
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i];
              if (column.getter) {
                newItem[column.field] = column.getter(item);
              }
            }
            // add actions Button
            newItem["actions"] = this.createActions(item);
            return newItem;
          })
          .map((item) => _.pick(item, fields))
      : [];

    if (permission < 2) {
      var noActionColumns = columns.filter((el) => el.field != "actions");
    }
    console.log("items2 \t", items)

    const data = {
      columns: noActionColumns || columns,
      rows: items,
    };
    return (
      permission >= 1  && (
        <div>
          {getCurrentPage ? (
            <div>
              {items && fromInfraction && permissions["P_EXCEL"]?
              <div className="d-flex justify-content-between">
                
                <div className="d-flex date-time" >     
                <DateTime
                  iconLeft={"fas-calendar"}
                  small={true}
                  timeFormat="HH:mm"
                  placeholder={t("LABEL_AJOUTER_AVANT_LE")}
                  sm={12}
                  labelSm={0}
                  name={"before"}
                  onChange={(d) => {
                    onChange({
                      target: { name: "before", value: d.valueOf() },
                    });
                  }}
                  value={before}
                  // buttonRight={<Button type="danger" title="clear" icon="fa-trash" onClick={() => onChange({
                  //   target: { name: "after", value: "" },
                  // })} />}
                />
                <DateTime
                  iconLeft={"far-calendar"}
                  small={true}
                  timeFormat="HH:mm"
                  sm={12}
                  labelSm={0}
                  onChange={(d) => {
                    onChange({
                      target: { name: "after", value: d.valueOf() },
                    });
                  }}
                  name="after"
                  placeholder={t("LABEL_AJOUTER_APRÉS_LE")}
                  value={after}
                  // buttonRight={<Button type="danger" title="clear" icon="fa-trash" onClick={() => onChange({
                  //   target: { name: "after", value: "" },
                  // })} />}
                  isDayBlocked={() => false}
                  isOutsideRange={() => false}
                />
              </div>
              <div  style={{
                position: "absolute",
                top: "10px"
              }}>
              <Button title={t("BTN_EXPORT")} 
              onClick={()=>this.ExportToExcel(items, fields)} icon="fa-file-excel" flat />
              </div>
              </div>
              
              :null}
              <MDBDataTable
                entriesLabel={t("TEXT_AFFICHER_LES_RÉSULTATS")}
                infoLabel={[t("TEXT_AFFICHAGE"), t("TEXT_DE"), t("TEXT_SUR"), t("TEXT_RESULTAT")]}
                paginationLabel={[t("TEXT_PRECEDENT"), t("TEXT_SUIVANT")]}
                searchLabel={t("TEXT_RECHERCHE")}
                striped
                bordered
                displayEntries={displayEntries}
                hover
                data={data}
                onSearch={changeData}
                responsive
                scrollX
                autoWidth
                paging={false}
              />
              <div>
                <ReactPaginate
                  pageCount={Math.ceil(itemsCount / 10)}
                  onPageChange={getCurrentPage}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  containerClassName="pagination"
                  subContainerClassName="pages pagination"
                  activeClassName="active"
                  forcePage={page}
                  breakClassName="break-me"
                  previousLabel={t("TEXT_PRECEDENT")}
                  nextLabel={t("TEXT_SUIVANT")}
                  style={{ float: "right" }}
                  breakLabel="..."
                />
              </div>
            </div>
          ) : (
            <MDBDataTable
              entriesLabel={t("TEXT_AFFICHER_LES_RÉSULTATS")}
              infoLabel={[t("TEXT_AFFICHAGE"), t("TEXT_DE"), t("TEXT_SUR"), t("TEXT_RESULTAT")]}
              paginationLabel={[t("TEXT_PRECEDENT"), t("TEXT_SUIVANT")]}
              searchLabel={t("TEXT_RECHERCHE")}
              striped
              bordered
              displayEntries={displayEntries}
              hover
              data={data}
              responsive
              autoWidth
            />
          )}
        </div>
      )
    );
  }
}
// active class

ItemsList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.arrayOf(PropTypes.object),
  additionalActions: PropTypes.array,
  Form: PropTypes.node.isRequired,
  update: PropTypes.oneOfType([PropTypes.func, () => null]),
  remove: PropTypes.oneOfType([PropTypes.func, () => null]),
  t: PropTypes.func, // translator
};

ItemsList.defaultProps = {
  items: [],
  columns: [],
  additionalActions: [],
  t: (text) => text,
  update: null,
  remove: null,
  users: [],
  roles: []
};

function mapStateToProps(state) {
  return {
    lang: state.persistedData.lang,
    permissions : state.persistedData.permissions,
    users: state.data.users,
    roles: state.data.roles
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getUsers: () => dispatch(User.get()),
    getRoles: () => dispatch(Role.get())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsList);
