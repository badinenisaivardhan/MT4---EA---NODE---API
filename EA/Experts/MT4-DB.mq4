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
input string NodeServer = "http://localhost";    // Server hostname or IP address


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
void OnTick(){OpenOrderHandler();}
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
      //Print(StringLen(json[0]["Orders"].ToStr())>0);
      //Print("OpenOrderHandler: No Pending Open Order To Be Executed");
   }
   else{
      CJAVal postjson;
      //Print(json.Size());
      for(int i=0;i<json.Size();i++){  
      int ticket=OrderSend(json[i]["Symbol"].ToStr(),json[i]["OderType"].ToStr(),json[i]["Lot"].ToDbl(),Ask,3,0,0,"SIMPLE BUY ORDER",123456,0,clrGreen);
      if(ticket<=0){
         Print("Failed To Place Orders",GetLastError());
      }
      if(ticket>1){
         postjson[i]["id"]=json[i]["_id"].ToStr();
         postjson[i]["ticket"]=ticket;
      }
      ticket = NULL;
      }
      Requests postopenrequest;
      Response postopenresponse = requests.post(checkOpenUrl,postjson.Serialize());
      postjson.Clear();
   }   
}


 
