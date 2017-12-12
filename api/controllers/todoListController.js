
var mongoose = require('mongoose');
var config = require('konfig')();
Task = mongoose.model('Tasks');
var jiraApi = require('jira').JiraApi;
var jira = new jiraApi('https', config.app.jira_host, config.app.jira_port, config.app.jira_user, config.app.jira_pass, config.app.jira_version);
var beautify = require ('json-beautify');

function extractValue(str,searchStr){

    var startOfSection = str.indexOf(searchStr);
    var startOfValue = str.indexOf('=',startOfSection)+1;
    var endOffValue  = str.indexOf(',',startOfValue); //Position of first char AFTER the value, as needed for substring

    var value = str.substring(startOfValue,endOffValue);

    return value;
}





exports.list_all_tasks = function(req, res) {
  Task.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.create_a_task = function(req, res) {
  var new_task = new Task(req.body);
  new_task.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.read_a_task = function(req, res) {
  Task.findById(req.params.taskId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.update_a_task = function(req, res) {
  Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.delete_a_task = function(req, res) {
  Task.remove({
    _id: req.params.taskId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};

exports.connect_to_Jira = function(req,res){

	jira.findIssue(req.params.ticketId, function(err, issue) {
		if (err)
		console.log(err);	
  		if(issue)		
  	res.send('done');
	console.log(beautify(issue,null,2,80));
	});
};


exports.get_ticket_sprint = function(req,res){
	jira.findIssue(req.params.ticketId, function(err, issue) {
		if (err)
		console.log(err);	
  		if(issue)	
  	var sprint = issue.fields.customfield_12442;
  	var sprint_string = JSON.stringify(sprint);
  	var sprintName = extractValue(sprint_string,'name');
	console.log('Sprint: ' + sprintName);
	res.send('done');
	return sprintName;

	});
};

exports.get_ticket_status = function(req,res){
	jira.findIssue(req.params.ticketId, function(err, issue) {
		if (err)
		console.log(err);	
  		if(issue)	
  	var status = issue.fields.status.name;	
  	res.send('done')
	console.log('Status: ' + status);
	return status;
	});
};



exports.get_ticket_last_comment = function(req,res){
	jira.getComments(req.params.ticketId, function(err, issue) {
		if (err)
		console.log(err);	
  		if(issue)	
  	var comments = issue.fields.comment.id;
  	res.send('done')
	console.log(beautify(comments,null,2,80));
	return comments;
	});
};

