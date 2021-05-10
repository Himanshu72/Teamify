const task = require("../schema/tashSchema");
const  utility=require("./DB")


module.exports={

    getTaskwithProj:async (groupobj)=>{
        
         let tasks= await utility.getTaskwithProj(groupobj.task);
            
         groupobj.forEach((ele,index) => {
                
         });
    }

};