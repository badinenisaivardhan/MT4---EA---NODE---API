const express = require('express');
const router = express.Router();
const db = require('diskdb');
const { route } = require('./client-ea4');
db.connect('./data', ['toopenorders']);
db.connect('./data', ['openorders']);
db.connect('./data', ['tocloseorders']);

//GET-ENDPOINTS
router.get('/',(req,res)=>{
    res.send("<h1>E.D.I.T.H</h1><br>");
})

router.get('/OpenOrder',(req,res)=>{
    const Order = { Symbol:"BTCUSD",OderType:"OP_BUY",Lot:"0.02" };
    db.toopenorders.save(Order);
    res.send(`Order Opened: Symbol:${Order.Symbol},OderType:${Order.OderType},Lot:${Order.Lot}`)
})

router.get('/CloseOrder',(req,res)=>{
    var orders = db.openorders.find();
    db.tocloseorders.save(orders);
    res.send(orders);
})

//POST-ENDPOINTS





module.exports = router;