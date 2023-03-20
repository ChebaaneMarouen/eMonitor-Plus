import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'adminlte-2-react';
import SweetAlert from 'sweetalert-react';

class RemoveItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlertConfirm: false,
    };
  }

  render() {
    const { item, t, onSubmit } = this.props;
    const { showAlertConfirm } = this.state;
    return (
      <div className="inline">
        <Button
          onClick={() => this.setState({ showAlertConfirm: true })}
          className="margin-r-5"
          size="xs"
          icon="fa-trash"
          type="danger"
        />
        <SweetAlert
          showCancelButton
          show={showAlertConfirm}
          title={t('TITLE_CETTE_ACTION_EST_IRRÉVERSIBLE')}
          text={`${t('TEXT_ÊTES-VOUS_SÛR_DE_VOULOIR_SUPPRIMER_')} ?`}
          type="warning"
          confirmButtonText={t('BTN_CONFIRMER')}
          cancelButtonText={t('BTN_ANNULER')}
          confirmButtonColor="#00a65a"
          onCancel={() => {
            this.setState({ showAlertConfirm: false });
          }}
          onConfirm={() => {
            onSubmit(item);
            console.log('TOYOY', onSubmit);
            this.setState({ showAlertConfirm: false });
          }}
        />
      </div>
    );
  }
}

RemoveItemModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  t: PropTypes.func,
  // eslint-disable-next-line
  item: PropTypes.object
};
RemoveItemModal.defaultProps = {
  t: String,
};

export default RemoveItemModal;
