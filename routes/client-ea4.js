const express = require('express');
const router = express.Router();
const JsonHandler = require('../Handler/JsonHandler');
const db = require('diskdb');
db.connect('./data', ['toopenorders']);
db.connect('./data', ['openorders']);
db.connect('./data', ['tocloseorders']);

//GET ENDPOINTS
router.get('/Ping',(req,res)=>{
    res.send("pong");
})


router.get('/OpenOrder',(req,res)=>{
        if (db.toopenorders.find().length) {
            var all = db.toopenorders.find();
            res.json(all);
         }else
         {
            res.status(200).json([{Orders:"None"}]);
         }
})

router.get('/CloseOrder',(req,res)=>{
      if (db.tocloseorders.find().length) {
          var all = db.tocloseorders.find();
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
      //console.log(`HitWithArrayLength :${idArray.length}`)
      for(let i=0;i<idArray.length;i++){
            db.openorders.save(idArray[i]);
            //Remove Order From Open Order To Avoid Re-Execution
            db.toopenorders.remove({ _id: idArray[i]["id"] });
       }
      res.send("OK");
      }
      else{
            //console.log("Client-EA4- PostMethod /OpenOrder");
            //console.log(idArray);
            res.send("OK");
      }
})

router.post('/CloseOrder',JsonHandler,(req,res)=>{ //JsonHandler
      var idArray = JSON.parse(req.body);
      console.log(req.body);
      if(idArray[0]["Orders"]=='None'){
            //Clear All Records If Nothing Is To Be Closed
            db.tocloseorders.remove();
      }
      else if(idArray[0]["ticket"]){
      //Remove All Records From TO Close
      db.tocloseorders.remove();
      for(let i=0;i<idArray.length;i++){
            //Adding Not Deleted Orders Back To ToCloseOrders Queue
            db.tocloseorders.save(idArray[i]);
         }
      }
      res.send("Ok");
})




module.exports = router;