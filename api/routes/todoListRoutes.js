
module.exports = function(app) {
  var ticketstatus = require ('../controllers/TicketStatusControllers.js')
  var todoList = require('../controllers/todoListController.js');
  var jiraList = require ('../controllers/jiraApiControllers.js');
  var smartsheet = require ('../controllers/smartsheetApiControllers.js');
var config = require('konfig')();
var testtest = config.app.jira_user;


  // todoList Routess
  // 
  // 
  // 
  // 

app.route('/tasks')
    .get(todoList.list_all_tasks)
    .post(todoList.create_a_task);

app.route('/jira/all/:ticketId')
	.get(todoList.connect_to_Jira);  

app.route('/jira/sprint/:ticketId')
	.get(todoList.get_ticket_sprint);

app.route('/jira/status/:ticketId')
	.get(todoList.get_ticket_status);

app.route('/jira2/ticket/fields/:ticketId')
	.get(jiraList.getissue__Jira);

app.route('/jira/comments/:ticketId')
	.get(todoList.get_ticket_last_comment);

app.route('/jira2/user/myself')
	.get(jiraList.getuser__Jira);


app.route('/jira2/board/all')
  .get(jiraList.getAllBoard_Jira);

app.route('/jira2/board/:boardId')
  .get(jiraList.getBoard_Jira);

  app.route('/testjira')
    .get(function(req,res){
      console.log(testtest);
      res.writeHeader(200,{'Content-Type':'text/html'})
      res.write('done');
       res.end();
    }); 

  app.route('/tasks/:taskId')
    .get(todoList.read_a_task)
    .put(todoList.update_a_task)
    .delete(todoList.delete_a_task);


//SMARTSHEET
app.route('/smartsheet/all')
  .get(smartsheet.getAllSmartsheet); 


app.route('/smartsheet/ticketlist')
  .get(smartsheet.getOneSmartsheet);

app.route('/smartsheet/column')
  .get(smartsheet.getOneColumnSmartsheet);

app.route('/smartsheet/row')
  .get(smartsheet.getOneRowSmarsheet);


  app.route('/menu')
  	.get(function(req, res) {
  res.writeHeader(200,{'Content-Type':'text/html'})
  res.write('<IFRAME WIDTH=1000 HEIGHT=700 FRAMEBORDER=0 SRC="https://app.smartsheet.com/b/publish?EQBCT=4e906fc4b65d4d9baf7c389753c39823"></IFRAME>');
  res.end();
});

};