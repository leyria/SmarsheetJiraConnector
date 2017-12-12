var mongoose = require('mongoose');
var config = require('konfig')();
Task = mongoose.model('Tasks');
var beautify = require ('json-beautify');
var JiraClient = require('jira-connector');
var jira = new JiraClient( {
    host: config.app.jira_host,
    basic_auth:{
    	username: config.app.jira_user,
    	password: config.app.jira_pass
    }
});



exports.getAllBoard_Jira = function(req,res){
	jira.board.getAllBoards('',function(err,board){
		if (err)
			console.log(err);
		if (board)
			res.send('done');
			console.log(beautify(board,null,2,80));
	})
}


exports.getBoard_Jira = function(req,res){
	jira.board.getBoard({boardId: req.params.boardId},function(err,board){
		if (err)
			console.log(err);
		if (board)
			res.send('done');
			console.log(beautify(board,null,2,80));
	})
}

exports.getissue__Jira = function(req,res){
	jira.issue.getIssue({issueKey: req.params.ticketId}, function(err, issue) {
		if (err)
		console.log(err);	
  		if(issue)		
  	res.send('done');
	console.log(beautify(issue.fields,null,2,80));
	});
};


exports.getuser__Jira = function(req,res){
	jira.issue.getIssue({Key:"matthieu.fougere",name:"Matthieu.Fougere"}, function(err, issue) {
		if (err)
		console.log(err);	
  		if(issue)		
  	res.send('done');
	console.log(beautify(user,null,2,80));
	});
};
