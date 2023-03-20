"use strict"
const path = require('path');
const request  = require('request');

const term  = require( 'terminal-kit' ).terminal;
const pathCmd = path.join(__dirname , "./getServices.py");
const pathServices = path.join(__dirname, "..");
var helper = require('./helper'); 


function printStatus(serviceStatus , services){

  term.reset();
  term.column(0).bold("Service Name") ;
  term.column(40).bold("Response Time") ;
  term.column(55).bold("Status");
  term.nextLine();
  for (var i = 0; i < services.length; i++) {
    var service = services[i];
    var status = serviceStatus[service.id] ;
    if(status){
      term.column(0).white(service.id);
      term.column(40).white(status.time+"\t\t");
      if(status.status){
        term.column(55).green("Alive");
      }else {
        term.column(55).red("Dead");
      }
    }else {
      term.column(0).white(service.id+"\t\t");
      term.column(40).white("???\t\t");
      term.column(55).yellow('Pending');

    }
    term.nextLine();

  }
}



  helper.run(pathCmd, pathServices , (services, serviceStatus)=>{
    setInterval(()=>{
      helper.checkServices(services);
      printStatus(serviceStatus,services);
    },1000)
  }) ;
 