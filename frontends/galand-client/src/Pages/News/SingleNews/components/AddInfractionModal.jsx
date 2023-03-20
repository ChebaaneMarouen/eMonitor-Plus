import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { infractionStatusEnum } from "Enums";
import Select from "components/Select";
import MyModal from "@shared/Components/MyModal";
import { Button, Inputs } from "adminlte-2-react";
import { Form, Col, Row } from "reactstrap";
import ImagePreview from "Pages/News/components/ImagePreview";
import { connect } from "react-redux";
import { Tags, ActorRessource } from "modules/ressources";
import Upload from "@shared/Components/Upload";
import { infractionsFilePath } from "modules/ressources";
import PropTypes from "prop-types";
const { Text, ImportWrapper } = Inputs;

class AddInfractionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infractionType: this.props.singleNews.infraction.infractionType
        ? this.props.singleNews.infraction.infractionType
        : "",
      comment: this.props.singleNews.infraction.comment ? this.props.singleNews.infraction.comment : "",
      files: this.props.singleNews.infraction.files ? this.props.singleNews.infraction.files : [],
      link: this.props.singleNews.infraction.link
        ? this.props.singleNews.infraction.link
        : this.props.singleNews.link,
      status: infractionStatusEnum.INFRACTION_A_VALIDER,
      responsible: this.props.singleNews.infraction.responsible
        ? this.props.singleNews.infraction.responsible
        : "",
    };
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }
  componentWillMount() {
    const { getTags, getActors } = this.props;
    getTags();
    getActors();
  }
  onChange(e) {
    const { value, name } = e.target;
    this.setState({
      [name]: value,
    });
  }

  submit(toggleModal) {
    const { createInfraction, singleNews, actors, tags } = this.props;
    console.log("actorssss", actors, singleNews.actor)

    let categories = "";
      for (let i = 0; i < singleNews.categories.length; i++) {
        const targetTag = tags ? tags.filter(t => t._id === singleNews.categories[i])[0]:null;
        if(targetTag){
          categories = categories + targetTag.label + " "
        }
            
      }
    
    let actor = actors.filter(el=> el.name === singleNews.actor);
    console.log("actorssss", actors, singleNews.actor, actor, categories, singleNews, tags)
    let actorType;
    if(actor[0]){
      actorType = actor[0].candidate_type;
    }
    console.log("actorssss", actors, singleNews.actor, actor, actorType)
    createInfraction({...this.state, createdAt:Date.now(), candidate : singleNews.actor, candidate_type : actorType, irie : categories});
    toggleModal();
  }
  getResponsibleTypeOptions(t) {
    return [
      {
        label: t("TEXT_A_CANDIDATE"),
        value: t("TEXT_A_CANDIDATE")
      },
      {
        label: t("TEXT_A_PARTY"),
        value: t("TEXT_A_PARTY")
      },
      {
        label: t("TEXT_ELECTRONIC_PAPER"),
        value: t("TEXT_ELECTRONIC_PAPER")
      },
      {
        label: t("TEXT_PRIVATE_RADIO"),
        value: t("TEXT_PRIVATE_RADIO")
      },
      {
        label: t("TEXT_PUBLIC_RADIO"),
        value: t("TEXT_PUBLIC_RADIO")
      },
      {
        label: t("TEXT_CIVIL_RADIO"),
        value: t("TEXT_CIVIL_RADIO")
      },
      {
        label: t("TEXT_PRIVATE_TV"),
        value: t("TEXT_PRIVATE_TV")
      },
      {
        label: t("TEXT_PUBLIC_TV"),
        value: t("TEXT_PUBLIC_TV")
      },
      {
        label: t("TEXT_FOREIGN_TV"),
        value: t("TEXT_FOREIGN_TV")
      },
      {
        label: t("TEXT_INFLUENCER_PAGE"),
        value: t("TEXT_INFLUENCER_PAGE")
      },
      {
        label: t("TEXT_YOUTUBE_CHANNEL"),
        value: t("TEXT_YOUTUBE_CHANNEL")
      },
      {
        label: t("TEXT_INSTAGRAM"),
        value: t("TEXT_INSTAGRAM")
      },
      {
        label: t("TEXT_TIK_TOK"),
        value: t("TEXT_TIK_TOK")
      },
      {
        label: t("TEXT_TWITTER"),
        value: t("TEXT_TWITTER")
      }
    ]
  }
  getLegalTextOptions(t) {
    return [
      {
        label: t("TEXT_01"),
        value: t("TEXT_01")
      },
      {
        label: t("TEXT_02"),
        value: t("TEXT_02")
      },
      {
        label: t("TEXT_03"),
        value: t("TEXT_03")
      },
      {
        label: t("TEXT_04"),
        value: t("TEXT_04")
      },
      {
        label: t("TEXT_05"),
        value: t("TEXT_05")
      },
      {
        label: t("TEXT_06"),
        value: t("TEXT_06")
      },
      {
        label: t("TEXT_07"),
        value: t("TEXT_07")
      },
      {
        label: t("TEXT_08"),
        value: t("TEXT_08")
      },
      {
        label: t("TEXT_09"),
        value: t("TEXT_09")
      },
      {
        label: t("TEXT_010"),
        value: t("TEXT_010")
      },
      {
        label: t("TEXT_011"),
        value: t("TEXT_011")
      },
      {
        label: t("TEXT_012"),
        value: t("TEXT_012")
      },
      {
        label: t("TEXT_013"),
        value: t("TEXT_013")
      },
      {
        label: t("TEXT_014"),
        value: t("TEXT_014")
      },
      {
        label: t("TEXT_015"),
        value: t("TEXT_015")
      },
      {
        label: t("TEXT_016"),
        value: t("TEXT_016")
      },
      {
        label: t("TEXT_017"),
        value: t("TEXT_017")
      },
      {
        label: t("TEXT_018"),
        value: t("TEXT_018")
      },
      {
        label: t("TEXT_019"),
        value: t("TEXT_019")
      },
      {
        label: t("TEXT_020"),
        value: t("TEXT_020")
      },
      {
        label: t("TEXT_021"),
        value: t("TEXT_021")
      },
      {
        label: t("TEXT_022"),
        value: t("TEXT_022")
      },
      {
        label: t("TEXT_023"),
        value: t("TEXT_023")
      },
      {
        label: t("TEXT_1"),
        value: t("TEXT_1")
      },
      {
        label: t("TEXT_2"),
        value: t("TEXT_2")
      },
      {
        label: t("TEXT_3"),
        value: t("TEXT_3")
      },
      {
        label: t("TEXT_4"),
        value: t("TEXT_4")
      },
      {
        label: t("TEXT_5"),
        value: t("TEXT_5")
      },
      {
        label: t("TEXT_6"),
        value: t("TEXT_6")
      },
      {
        label: t("TEXT_7"),
        value: t("TEXT_7")
      },
      {
        label: t("TEXT_8"),
        value: t("TEXT_8")
      },
      {
        label: t("TEXT_9"),
        value: t("TEXT_9")
      },
      {
        label: t("TEXT_10"),
        value: t("TEXT_10")
      },
      {
        label: t("TEXT_11"),
        value: t("TEXT_11")
      },
      {
        label: t("TEXT_12"),
        value: t("TEXT_12")
      },
      {
        label: t("TEXT_13"),
        value: t("TEXT_13")
      },
      {
        label: t("TEXT_14"),
        value: t("TEXT_14")
      },
      {
        label: t("TEXT_15"),
        value: t("TEXT_15")
      },
      {
        label: t("TEXT_16"),
        value: t("TEXT_16")
      },
      {
        label: t("TEXT_17"),
        value: t("TEXT_17")
      },
      {
        label: t("TEXT_18"),
        value: t("TEXT_18")
      },
      {
        label: t("TEXT_19"),
        value: t("TEXT_19")
      },
      {
        label: t("TEXT_20"),
        value: t("TEXT_20")
      },
      {
        label: t("TEXT_21"),
        value: t("TEXT_21")
      },
      {
        label: t("TEXT_22"),
        value: t("TEXT_22")
      },
      {
        label: t("TEXT_23"),
        value: t("TEXT_23")
      },
      {
        label: t("TEXT_24"),
        value: t("TEXT_24")
      },
      {
        label: t("TEXT_25"),
        value: t("TEXT_25")
      },
      {
        label: t("TEXT_26"),
        value: t("TEXT_26")
      },
      {
        label: t("TEXT_27"),
        value: t("TEXT_27")
      },
      {
        label: t("TEXT_28"),
        value: t("TEXT_28")
      },
      {
        label: t("TEXT_29"),
        value: t("TEXT_29")
      },
      {
        label: t("TEXT_30"),
        value: t("TEXT_30")
      },
      {
        label: t("TEXT_31"),
        value: t("TEXT_31")
      },
      {
        label: t("TEXT_32"),
        value: t("TEXT_32")
      },
      {
        label: t("TEXT_33"),
        value: t("TEXT_33")
      },
      {
        label: t("TEXT_34"),
        value: t("TEXT_34")
      },
      {
        label: t("TEXT_35"),
        value: t("TEXT_35")
      },
      {
        label: t("TEXT_36"),
        value: t("TEXT_36")
      },
      {
        label: t("TEXT_37"),
        value: t("TEXT_37")
      },
      {
        label: t("TEXT_38"),
        value: t("TEXT_38")
      },
      {
        label: t("TEXT_39"),
        value: t("TEXT_39")
      },
      {
        label: t("TEXT_40"),
        value: t("TEXT_40")
      },
      {
        label: t("TEXT_DONT_MATCH"),
        value: t("TEXT_DONT_MATCH")
      }
    ];
  }
  render() {
    const { t } = this.props;
    console.log("state", this.state)
    const { infractionType, comment, files, link, responsible, 
      proof_link, infraction_date, text_infraction, page_id, responsibleType } = this.state;
    let infractionsTypesSettings = this.props.settings.filter(
      (setting) => setting._id == "Infractions Types"
    )[0]
      ? this.props.settings.filter((setting) => setting._id == "Infractions Types")[0].InfractionType
          .value
      : [];
    return (
      <MyModal
        submitText={t("BTN_AJOUTER")}
        submit={this.submit}
        title={t("TITLE_CREÉR_INFRACTION")}
        size="xl"
        button={
          <Button
            block={true}
            pullRight={true}
            icon={"fa-plus"}
            type="primary"
            text={t("BTN_CRÉER_INFRACTION")}
          />
        }
      >
        <Row>
          <Form>
            <Col sm="12">
              <Select
                placeholder={t("LABEL_TYPE_INFRACTION")}
                label={t("LABEL_TYPE_INFRACTION")}
                iconLeft={"fas-share-alt"}
                name="infractionType"
                onChange={this.onChange}
                value={infractionType}
                options={this.getLegalTextOptions(t)}
              />
            </Col>
            <Col sm="12"><div style={{height:"20px"}}></div></Col>
            <Col sm="12">
              <Text
                onChange={this.onChange}
                value={link || ""}
                labelClass={"required"}
                inputType={"url"}
                style={{ display: "none" }}
                iconLeft={"fa-link"}
                placeholder={"https://exemple.com/"}
                buttonRight={link && <ImagePreview url={link} addInfraction={true}/>}
                label={t("LABEL_LIEN_DE_LARTICLE") + ":"}
                name="link"
              />
            </Col>
            <Col sm="12"><div style={{height:"20px"}}></div></Col>
            <Col sm="12">
              <Text
                label={t("LABEL_DESCRIPTION_INFRACTION")}
                placeholder={t("LABEL_DESCRIPTION_INFRACTION")}
                inputType="textarea"
                name={"comment"}
                value={comment}
                onChange={this.onChange}
              />
            </Col>
            <Col sm="12"><div style={{height:"20px"}}></div></Col>
            <Col sm="12">
              <Text
                onChange={this.onChange}
                value={responsible || ""}
                labelClass={"required"}
                inputType={"text"}
                style={{ display: "none" }}
                label={t("LABEL_RESPONSIBLE_PART") + ":"}
                name="responsible"
              />
            </Col>
            <Col sm="12"><div style={{height:"20px"}}></div></Col>
            <Col sm="12">
              <Select
                placeholder={t("LABEL_RESPONSIBLE_TYPE")}
                label={t("LABEL_RESPONSIBLE_TYPE")}
                iconLeft={"fa-list"}
                name="responsibleType"
                onChange={this.onChange}
                value={responsibleType}
                options={this.getResponsibleTypeOptions(t)}
              />
            </Col>
            <Col sm="12"><div style={{height:"20px"}}></div></Col>
            <Col sm="12">
              <Text
                label={t("LABEL_INFRACTION_DATE")}
                placeholder={t("LABEL_INFRACTION_DATE")}
                inputType="date"
                name={"infraction_date"}
                value={infraction_date || ""}
                onChange={this.onChange}
              />
            </Col>
            <Col sm="12"><div style={{height:"20px"}}></div></Col>
            <Col sm="12">
              <Text
                label={t("LABEL_TEXT_INFRACTION")}
                placeholder={t("LABEL_TEXT_INFRACTION")}
                inputType="textarea"
                name={"text_infraction"}
                value={text_infraction}
                onChange={this.onChange}
              />
            </Col>
            <Col sm="12"><div style={{height:"20px"}}></div></Col>
            <Col sm="12">
              <Text
                label={t("LABEL_PROOF_LINK")}
                placeholder={t("LABEL_PROOF_LINK")}
                inputType="url"
                name={"proof_link"}
                value={proof_link}
                onChange={this.onChange}
              />
            </Col>
            <Col sm="12"><div style={{height:"20px"}}></div></Col>
            <Col sm="12">
              <Text
                label={t("LABEL_PAGE_ID")}
                placeholder={t("LABEL_PAGE_ID")}
                inputType="text"
                name={"page_id"}
                value={page_id}
                onChange={this.onChange}
              />
            </Col>
            <Col sm="12"><div style={{height:"20px"}}></div></Col>
            <Col sm="12">
              <ImportWrapper label={t("LABEL_PREUVES") + ":"}>
                <Upload
                  name="files"
                  onChange={this.onChange}
                  allowMultiple={true}
                  server={infractionsFilePath}
                  defaultValue={files}
                />
              </ImportWrapper>
            </Col>
            <br />
          </Form>
        </Row>
      </MyModal>
    );
  }
}

AddInfractionModal.propTypes = {
  tags: PropTypes.array,
  fName: PropTypes.string,
  lName: PropTypes.string,
  settings: PropTypes.array,
};

AddInfractionModal.defaultProps = {
  tags: [],
  fName: "",
  lName: "",
  settings: [],
  actors : []
};

function mapStateToProps(state) {
  return {
    tags: state.data.tags,
    fName: state.persistedData.fName,
    lName: state.persistedData.lName,
    settings: state.data.settings,
    actors : state.data.actors
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getTags: () => dispatch(Tags.get()),
    getActors: () => dispatch(ActorRessource.get()),
  };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(AddInfractionModal));
