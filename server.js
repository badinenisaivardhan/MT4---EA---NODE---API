//Required Libs
const express = require('express');
const app = express();
const port = 80;
const bodyParser = require('body-parser');
const WebRoutes = require('./routes/web');
const Client_EA4_Routes = require('./routes/client-ea4');
const ApiRoutes = require('./routes/api');


//MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
//Routes
app.use('/',WebRoutes);
app.use('/Client',Client_EA4_Routes);
app.use('/API',ApiRoutes);

//StartUp Server
app.listen(port,()=>{
    console.log(`Express Server Started On Port ${port}`)
});