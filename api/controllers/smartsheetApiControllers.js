var mongoose = require('mongoose');
var async = require('async');
var config = require('konfig')();
Task = mongoose.model('Tasks');
var beautify = require ('json-beautify');
var client = require('smartsheet');
var smartsheet = client.createClient({
  accessToken: '58zyiq999gah5ecy3lkb3iq1u6',
  logLevel: 'info'
});
var jiraApi = require('jira').JiraApi;
var jira = new jiraApi('https', config.app.jira_host, config.app.jira_port, config.app.jira_user, config.app.jira_pass, config.app.jira_version);




var startrow = 5266984698963844;
var options = {
  sheetId: 900510493501316,
  rowId: startrow,
  columnId: 8131883654506372
};



		


exports.getAllSmartsheet = function(req,res){
		smartsheet.sheets.listSheets({}, function(err, sheet) {
	  if (err) {
	    console.log(err);
	  } else {
	    console.log(sheet);
	  }
	});
}



exports.getOneSmartsheet = function(req,res){
		smartsheet.sheets.getSheet({id:900510493501316}, function(err, sheet) {
	  if (err) {
	    console.log(err);
	  } else {
	    console.log(sheet);
	    res.send('done');
	  }
	});
}



exports.getOneRowSmarsheet = function(req,res){
	// Set options
	var options = {
	  sheetId: 900510493501316,
	  rowId:  3789241071232900
	};
	// Get row
	smartsheet.sheets.getRow(options,function(err,row){
		if(err){
			console.log(err);
		}
		else{
			console.log(row);
			res.send('done');
		}
	});
}


exports.getOneColumnSmartsheet = function(req,res){
	

	smartsheet.sheets.getColumns({id:99}, function(err, sheet) {
	  if (err) {
	    console.log(err);
	  } else {
	    console.log(columns);
	    res.send('done');
	  }
	});
}





function TicketNumber (req,res){
	var startrow = 5266984698963844;
	var options = {
	  sheetId: 900510493501316,
	  rowId: startrow,
	  columnId: 8131883654506372
	};
	smartsheet.sheets.getCellHistory(options,function(err,cell){
		if(err){
			console.log(err);
		}
		else{

			console.log(cell.data[0].value);
		}

	})
}





function getTicketNumber(err,status){
	smartsheet.sheets.getCellHistory(options)

}


/*
function StatusUpdate (req,res){
	smartsheet.sheets.getCellHistory(options,function(err,cell){
		if(err) return console.error(err);
		var ticketnumber = cell.data[0].value;
		console.log(ticketnumber);
		jira.findIssue(ticketnumber, function(err, issue) {
			if (err) return console.error(err);
	  		var status = issue.fields.status.name;
	  		var row = [
					  {
					    "id": startrow,
					    "cells": [
					      {
					        "columnId": 3065334073714564,
					        "value": status
					      }]
					    }
					];	
			var options = {
				  sheetId: 900510493501316,
				  body: row
				  };

			smartsheet.sheets.updateRow(options,function(err,data){
				if(err) console.error(err);
				console.log(data);
				var options = {
				  sheetId: 900510493501316,
				  rowId:  startrow
					};
				
			smartsheet.sheets.getRow(options,function(err,row){
				if (err) console.log(err);
					console.log(row.siblingId);
					startrow = row.siblingId;
					console.log(startrow);
					})
				
			})
					
		});
	}
});
}























function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

exports.updatestatus = function(req,res){

		 StatusUpdate(req,res)	;
		 wait(7000);


}



exports.updateOneCellSmartsheet = function(req,res){
	// Specify updated cell values
var row = [
  {
    "id": "1080044420392836",
    "cells": [
      {
        "columnId": 3065334073714564,
        "value": "DEPLdsfgdfgOYING"
      }]
    }
];
// Set options
var options = {
  sheetId: 900510493501316,
  body: row
  };
smartsheet.sheets.updateRow(options,function(err,data){
	if(err){
		console.log(err);
	}
	else{
		console.log(data);
		res.send('updated');
	}
})
}  





*/



//3065334073714564,