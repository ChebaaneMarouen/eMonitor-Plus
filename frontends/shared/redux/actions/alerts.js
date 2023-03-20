function generateAlert(message, type) {
  return {
    id: new Date().getTime() + Math.random(),
    message,
    type,
  };
}
export function addAlert({ message, type = 'info' }) {
  return {
    type: 'ADD_ALERT',
    alert: generateAlert(message, type),
  };
}

export function dismissAlert(alert) {
  return {
    type: 'DISMISS_ALERT',
    alert,
  };
}
