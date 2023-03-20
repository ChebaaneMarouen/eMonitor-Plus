module.exports = function({Notification}) {  
    function updateNotification(oldNotification) {
      oldNotification["seen"] = true;
      return oldNotification.save();
    }
  
    return {
        updateNotification
    };
  };
  