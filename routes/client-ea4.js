const express = require('express');
const router = express.Router();
const JsonHandler = require('../Handler/JsonHandler');
const db = require('diskdb');
db.connect('./data', ['toopenorders']);
db.connect('./data', ['openorders']);

//GET ENDPOINTS
router.get('/Ping',(req,res)=>{
    res.send("pong");
})


router.get('/OpenOrder',(req,res)=>{
        if (db.toopenorders.find().length) {
            const all = db.toopenorders.find();
            res.json(all);
         }else
         {
            res.status(200).json([{Orders:"None"}]);
         }
})

//MT4-EA- Client Routes - POST Methods
router.post('/OpenOrder',JsonHandler,(req,res)=>{
      var idArray = JSON.parse(req.body);
      if(idArray){
      for(let i=0;i<idArray.length;i++){
            db.openorders.save(idArray[i]);
            //Remove Order From Open Order To Avoid Re-Execution
            db.toopenorders.remove({ _id: idArray[i]["id"] });
       }
      res.send("OK");
      }
      else{
            console.log("Client-EA4- PostMethod /OpenOrder");
            console.log(idArray);
            res.send("OK");
      }
})





module.exports = router;