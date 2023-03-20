const _ = require('lodash');

export default function mainReducer(state, action) {
  switch (action.type) {
    case 'ADD_ALERT':
      let alerts = state.alerts || [];
      // add alert after removing duplicates
      alerts = alerts
        .filter(({ message }) => message !== action.alert.message)
        .concat(action.alert);
      return { ...state, alerts: (state.alerts || []).concat(action.alert)};

    case 'DISMISS_ALERT': {
      const alerts = state.alerts.filter(
        (a) => a.message !== action.alert.message,
      );
      return { ...state, alerts };
    }

    case 'isFetching':
      return {
        ...state,
        isFetching: { ...state.isFetching, ...action.payloaad },
      };

    case 'isRemoving':
      return {
        ...state,
        isRemoving: { ...state.isRemoving, ...action.payloaad },
      };

    case 'isUpdating':
      return {
        ...state,
        isUpdating: { ...state.isUpdating, ...action.payloaad },
      };

    case 'fetch': {
      if (!action.payload.append) return { ...state, [action.payload.dataType]: action.payload.value };
      const { dataType, value } = action.payload;
      const oldValues = state[dataType] || [];
      return { ...state, [dataType]: oldValues.concat(value) };
    }
    case 'update':
    case 'insert': {
      const { dataType, value } = action.payload;
      if (!value || !value._id) return state;
      const oldValues = state[dataType] || [];

      const newValues = [value].concat(
        oldValues.filter((oldValue) => oldValue._id !== value._id),
      );
      return { ...state, [dataType]: newValues };
    }

    case 'remove': {
      const { dataType, value } = action.payload;

      if (!value || !value._id) return state;
      const oldValues = state[dataType] || [];

      const newValues = oldValues.filter(
        (oldValue) => oldValue._id !== value._id,
      );
      return { ...state, [dataType]: newValues };
    }
    default:
      if (action.error) {
        return _.merge(state, { error: action.payload });
      }
      return { ...state, ...action };
  }
}
