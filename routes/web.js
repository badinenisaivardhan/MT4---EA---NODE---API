const express = require('express');
const router = express.Router();
const db = require('diskdb');
db.connect('./data', ['toopenorders']);
db.connect('./data', ['openorders']);

//GET-ENDPOINTS
router.get('/',(req,res)=>{
    res.send("<h1>E.D.I.T.H</h1><br>");
})

router.get('/OpenOrder',(req,res)=>{
    const Order = { Symbol:"BTCUSD",OderType:"OP_BUY",Lot:"0.02" };
    db.toopenorders.save(Order);
    res.send(`Order Opened: Symbol:${Order.Symbol},OderType:${Order.OderType},Lot:${Order.Lot}`)
})

router.post('/CloseOrder',(req,res)=>{
    var orders = req.body;
    for(let i=0;i<orders.length;i++){
        var tocloseorder = db.openorders.find({ticket:orders[i]["ticket"]})
        console.log(tocloseorder);
        
    }
    res.send("Ok")
})
//POST-ENDPOINTS





module.exports = router;