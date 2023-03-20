let request = require('request');
const util = require('util');


module.exports = (()=>{

    function ping(address){
        return new Promise((resolve,reject)=>{
            const start = Date.now();
            request(address , (err,response,body)=>{
                if(err){
                    reject(err);
                }else{
                    resolve({
                        time : Date.now() - start
                    });
                }
            });

        });
    }

    return {
        ping
    };

})();
