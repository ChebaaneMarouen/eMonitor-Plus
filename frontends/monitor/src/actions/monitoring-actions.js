import { addTrailingSlash } from "../helpers/fix-url";

export default function getActions(hostname) {
  function getServiceLogs(containerId) {
    return fetch(addTrailingSlash(hostname) + "logs/" + containerId, {})
      .then(res => res.json())
      .catch(err => {
        console.log(err);
      });
  }

  function getMonitoredServices() {
    return fetch(addTrailingSlash(hostname) + "monitored", {})
      .then(res => res.json())
      .catch(err => {
        console.log(err);
      });
  }

  function deleteMonitoredContainer(container) {
    return fetch(
      addTrailingSlash(hostname) + "monitored/" + container.containerId,
      {
        method: "DELETE"
      }
    )
      .then(res => res.json())
      .catch(err => {
        console.log(err);
      });
  }

  function createMonitoredContainer(container) {
    return fetch(addTrailingSlash(hostname) + "monitored", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(container)
    })
      .then(res => res.json())
      .catch(err => {
        console.log(err);
      });
  }

  function updateMonitoredService(container) {
    if (container.isMonitored) {
      return deleteMonitoredContainer(container);
    } else {
      return createMonitoredContainer(container);
    }
  }
  return {
    getServiceLogs,
    updateMonitoredService,
    createMonitoredContainer,
    deleteMonitoredContainer,
    getMonitoredServices
  };
}
