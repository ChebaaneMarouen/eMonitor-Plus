import React, { Component } from 'react';
import { Inputs, Content, Row, Col, Box, Button } from 'adminlte-2-react';
import { MDBDataTable } from 'mdbreact';
import './Users.css';
import Form from "reactstrap/es/Form";
import SweetAlert from 'sweetalert-react';
import 'sweetalert/dist/sweetalert.css';
const { Text,Select2 } = Inputs;

class Users extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showAlertConfirm: false,
            isAddModal:true,
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
      this.data = {
      columns: [ 
            {
                label: 'Email',
                field: 'email',
                sort: 'asc',
            },
            {
                label: 'Nom',
                field: 'nom',
            },
            {
                label: 'Prenom',
                field: 'prenom',
            },
            {
                label: 'Rôle',
                field: 'role',
            },
            {
                label: 'Téléphone',
                field: 'num',
            },
            {
                label: 'Établissement',
                field: 'etablissement',
            },
            {
                label: 'Actions',
                field: 'actions',
                sort: 'disabled',
            },
        ],
        rows: [
            {
                email: 'Tiger HAMADI',
                nom: 'System Architect',
                prenom: 'Edinburgh',
                role: 'Journaliste',
                num: '21 152 125',
                etablissement: 'HAICA',
                actions: [<Button onClick={() => this.openModal(false)} className={"margin-r-5"} size={"xs"}  icon={"fa-user-edit"} type="warning"  />,<Button onClick={() => this.setState({ showAlertConfirm: true })} size={"xs"}  icon={"fa-trash"} type="danger"  />]
            },
        ]
    };
    }
    openModal(isAdd) {
        console.log(this.state.showAlertConfirm);
        if(isAdd)
            this.setState({showModal:true,isAddModal:true});
        else
            this.setState({showModal:true,isAddModal:false});
    }
    closeModal() {
        this.setState({showModal:false});

    }
    render() {
        return (
            <div>
                <Content title="Gestion des utilisateurs" browserTitle="Gestion des utilisateurs">
                    <Row>
                        <Col xs={12}>
                            <Box type="info"
                                 footer={
                                     <Button block={true} pullRight={true} icon={"fa-user-plus"} type="success" onClick={() => this.openModal(true)} text="Ajouter un utilisateur" />
                                 } >
                                <MDBDataTable
                                    striped
                                    bordered
                                    hover
                                    data={this.data}
                                    responsive
                                    autoWidth
                                    entriesLabel={"Afficher les résultats"}
                                    infoLabel={["Affichage", "de", "sur", "résultats"]}
                                    paginationLabel={["Précédent", "Suivant"]}
                                    searchLabel={ "Recherche"}
                                />
                            </Box>
                        </Col>
                    </Row>
                </Content>
                <Content  show={this.state.showModal}   modal={true} title={this.state.isAddModal?"Ajouter un utilisateur":"Modifier l'utilisateur"} onHide={this.closeModal} modalFooter={
                    <Button className={"col-md-4"} block={true} icon={this.state.isAddModal?"fa-user-plus":"fa-user-edit"} type={this.state.isAddModal?"success":"warning"} text={this.state.isAddModal?"Ajouter":"Modifier"} />
                }>
                    <Form className={"form-horizontal"}>
                        <Text   inputType={"email"} labelClass={"required"} iconLeft={"fa-at"} sm={8} labelSm={4} label={"Email: "} placeholder={"Email"}/>
                        {!this.state.isAddModal && <Text   labelClass={"required"} iconLeft={"fa-address-card"}  sm={8} labelSm={4} label={"Nom: "} placeholder={"Nom"}/>}
                        {!this.state.isAddModal && <Text   labelClass={"required"} iconLeft={"fa-address-card"}  sm={8} labelSm={4} label={"Prénom: "} placeholder={"Prenom"}/>}
                        <Select2  labelClass={"required"} iconLeft={"fa-user-shield"} options={["Journaliste","Moniteur","Super moniteur","Décideur", "Administrateur", "Administrateur Système"]} sm={8} labelSm={4} label={"Rôle: "} placeholder={"Rôle"}/>
                        {!this.state.isAddModal && <Text  iconLeft={"fa-phone-square-alt"} sm={8}  labelSm={4} label={"Numéro de téléphone: "} placeholder={"Numéro de téléphone"}/>}
                        {!this.state.isAddModal && <Text  iconLeft={"fa-building"}  sm={8} labelSm={4} label={"Établissement: "} placeholder={"Établissement"}/>}
                    </Form>
                </Content>
                 <SweetAlert
                    show={this.state.showAlertConfirm}
                    title="Cette action est irréversible"
                    text={"Êtes-vous sûr de vouloir supprimer "+ this.state.showModal+ " ?"}
                    type="warning"
                    confirmButtonText= 'Confirmer'
                    showCancelButton="true"
                    cancelButtonText= 'Annuler'
                    confirmButtonColor= '#00a65a'
                      onCancel={() => {
                        console.log('cancel'); // eslint-disable-line no-console
                        this.setState({ showAlertConfirm: false });
                    }}
                    onConfirm={() => {
                        console.log('confirm'); // eslint-disable-line no-console
                        this.setState({ showAlertConfirm: false });
                    }}


                />
            </div>
        );
    }
}

export default Users;
