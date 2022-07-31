//+------------------------------------------------------------------+
//|                                                       MT4-DB.mq4 |
//|                                             Sai Vardhan Badineni |
//|                                             https://www.mql5.com |
//+------------------------------------------------------------------+
#property copyright "Sai Vardhan Badineni"
#property link      ""
#property version   "1.00"
#property strict
//+------------------------------------------------------------------+
//| Expert initialization function                                   |
//+------------------------------------------------------------------+
#include <JAson.mqh>
#include <requests/requests.mqh> 

input string Developer = "Sai Vardhan Badineni";
input string GitHub = "github.com/badinenisaivardhan";
input string NodeServer = "http://localhost";   
input int Common = 2023;

int OnInit()
  {
   string headers;
   char post[],result[];
   int res;
   int timeout=5000;
   res=WebRequest("GET",NodeServer+"/ping",NULL,NULL,timeout,post,0,result,headers);
   if(res==-1)
     {
      Print("Node Server Is Not Reachable"); 
      return(INIT_FAILED);
     }
   else{
      OpenOrderHandler();
      CloseOrderHandler();
      return(INIT_SUCCEEDED);
     }
 
 }
  

//+------------------------------------------------------------------+
//| Expert deinitialization function                                 |
//+------------------------------------------------------------------+

void OnDeinit(const int reason)
  {
   
  }
//+------------------------------------------------------------------+
//| Expert tick function                                             |
//+------------------------------------------------------------------+
void OnTick(){
OpenOrderHandler();
CloseOrderHandler();
}
//+------------------------------------------------------------------+

//HandlerFunctions

void OpenOrderHandler(){
   CJAVal json ;
   string checkOpenUrl = NodeServer + "/Client/OpenOrder";
   Requests requests;
   Response response = requests.get(checkOpenUrl);
   string responseString = response.text;
   json.Deserialize(responseString);
   if(StringLen(json[0]["Orders"].ToStr())>0){
   }
   else{
      CJAVal postjson;
      for(int i=0;i<json.Size();i++){  
      double askvalue = Ask;
      int ticket=OrderSend(json[i]["Symbol"].ToStr(),json[i]["OderType"].ToStr(),json[i]["Lot"].ToDbl(),askvalue,3,0,0,"SIMPLE BUY ORDER",123456,0,clrGreen);
      if(ticket<=0){
         Print("Failed To Place Orders",GetLastError());
      }
      if(ticket>1){
         postjson[i]["ticket"]=ticket;
         postjson[i]["id"]=json[i]["_id"].ToStr();
         postjson[i]["Symbol"]=json[i]["Symbol"];
         postjson[i]["OrderType"]=json[i]["OrderType"];
         postjson[i]["Lot"]=json[i]["Lot"];
         postjson[i]["Common"]=Common;
      }
     }
     Requests postopenrequest;
     Response postopenresponse = requests.post(checkOpenUrl,postjson.Serialize());
     postjson.Clear();
   }   
}


 void CloseOrderHandler(){
   CJAVal json1 ;
   string checkCloseUrl = NodeServer + "/Client/CloseOrder";
   Requests requests1;
   Response response1 = requests1.get(checkCloseUrl);
   string responseString1 = response1.text;
   json1.Deserialize(responseString1);
   if(StringLen(json1[0]["Orders"].ToStr())>0){
   }
   else{
   CJAVal postjson1;
   for(int i=0;i<json1.Size();i++){  
      bool closeordercheck = OrderClose(json1[i]["ticket"].ToInt(),json1[i]["Lot"].ToDbl(),Ask,3,Red);
      if(!closeordercheck){
         postjson1[i]["ticket"]=json1[i]["ticket"];
         postjson1[i]["id"]=json1[i]["id"].ToStr();
         postjson1[i]["Symbol"]=json1[i]["Symbol"];
         postjson1[i]["OrderType"]=json1[i]["OrderType"];
         postjson1[i]["Lot"]=json1[i]["Lot"];
         postjson1[i]["Common"]=Common;
         
      }
   }
   if(StringLen(postjson1[0]["ticket"].ToStr())>1){
      Requests postcloserequest;
      Response postcloseresponse = postcloserequest.post(checkCloseUrl,postjson1.Serialize());
      postjson1.Clear();  
      }
    else{
      CJAVal noorder;
      noorder["Orders"]="None";
      Requests postcloserequest;
      Response postcloseresponse = postcloserequest.post(checkCloseUrl,noorder.Serialize());
    }
   }
 }   
