export let hostname = (() => {
  const server = window.location.host;
  const protocol = window.location.protocol;
  const endPoint = "/api/monitor/";
  return protocol + "//" + server + endPoint;
})();
const endPoint = "/api/monitor/";
export const socketConf = {
  path: `${endPoint}socket.io`
};
