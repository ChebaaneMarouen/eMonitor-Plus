const {kibanaStatUrl} = require("../config");
module.exports = function (){

    function getAppStat(appId){
        console.log(kibanaStatUrl.replace(/<appid>/g,appId));
        return kibanaStatUrl.replace(/<appid>/g,appId);
    }

    return {
        getAppStat
    };
};
