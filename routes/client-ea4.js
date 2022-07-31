const express = require('express');
const router = express.Router();
const JsonHandler = require('../Handler/JsonHandler');
const db = require('diskdb');
db.connect('./data', ['PendingOrderQueue']);
db.connect('./data', ['RunningOrderQueue']);
db.connect('./data', ['CloseOrderQueue']);

//GET ENDPOINTS
router.get('/OpenOrder',(req,res)=>{
        if (db.PendingOrderQueue.find().length) {
            var all = db.PendingOrderQueue.find();
            res.json(all);
         }else
         {
            res.status(200).json([{Orders:"None"}]);
         }
})

router.get('/CloseOrder',(req,res)=>{
      if (db.CloseOrderQueue.find().length) {
          var all = db.CloseOrderQueue.find();
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
            db.RunningOrderQueue.save(idArray[i]);
            db.PendingOrderQueue.remove({ _id: idArray[i]["id"] });
       }
            res.send("OK");
      }
      else{
            res.send("OK");
      }
})

router.post('/CloseOrder',JsonHandler,(req,res)=>{ //JsonHandler
      var idArray = JSON.parse(req.body);
      if(idArray[0]["Orders"]=="None"){
            db.CloseOrderQueue.remove({"Common":2023});
      }
      else if(idArray[0]["ticket"]>0){
      db.CloseOrderQueue.remove({"Common":2023});
      db.CloseOrderQueue.save(idArray);
      }
      res.send("Ok");
})




module.exports = router;