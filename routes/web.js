const express = require('express');
const router = express.Router();
const db = require('diskdb');
const { route } = require('./client-ea4');
db.connect('./data', ['PendingOrderQueue']);
db.connect('./data', ['RunningOrderQueue']);
db.connect('./data', ['CloseOrderQueue']);

//GET-ENDPOINTS
router.get('/',(req,res)=>{
    res.render('index')
})

router.get('/PlacedOrders',(req,res)=>{
    if(db.PendingOrderQueue.find().length){
    res.status(200).json([db.PendingOrderQueue.find()]);}
    else{
        res.status(200).json([{Orders:"None"}]); 
    }
})

router.get('/CloseOrder',(req,res)=>{
    var orders = db.RunningOrderQueue.find();
    if(orders.length){
        var copiedorders = db.CloseOrderQueue.save(orders);
        db.RunningOrderQueue.remove({"Common":2023});
        res.send(copiedorders);
    }
    else{
        res.status(200).json([{Orders:"None"}]);
    }

})

//POST-ENDPOINTS

router.post('/OpenOrder',(req,res)=>{
    var orderdetails = req.body;
    orderdetails["Time"] = Date.now();
    db.PendingOrderQueue.save(orderdetails);
    res.status(200).json([orderdetails]);
})




module.exports = router;