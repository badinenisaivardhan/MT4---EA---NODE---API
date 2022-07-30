module.exports = function JsonHandler(req, res,next) {
    var request = JSON.stringify(req.body);
    var firstchange = JSON.parse(request.substring(1,request.length-4));
    var secondchange = `[${firstchange}]`
    //console.log(secondchange);
    req.body = secondchange 
    //JSON.parse(request.substring(1,request.length-4));
    next();
  };