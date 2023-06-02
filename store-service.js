const fs = require("fs");
let categories = [];

module.exports.initialize = function(){
    return new Promise((resolve,reject)=>{
        fs.readFile('./data/categories.json',(err,data)=>{
            if(err){
                reject(err);
            }else{
                categories = JSON.parse(data);
                resolve();
            }
        })
    })

}