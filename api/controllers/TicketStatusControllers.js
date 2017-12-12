var config = require('konfig')();
var beautify = require('json-beautify');
var client = require('smartsheet');
var async = require('watt');
var smartsheet = client.createClient({
	accessToken: '58zyiq999gah5ecy3lkb3iq1u6',
	logLevel: 'info'
});
var jiraApi = require('jira').JiraApi;
var jira = new jiraApi('https', config.app.jira_host, config.app.jira_port, config.app.jira_user, config.app.jira_pass, config.app.jira_version);

if (typeof localStorage === "undefined" || localStorage === null) {
	var LocalStorage = require('node-localstorage').LocalStorage;
	localStorage = new LocalStorage('./scratch');
}
var startrow = 3155922373633924;
var options = {
	sheetId: 900510493501316,
	rowId: startrow,
	columnId: 8131883654506372
};

var status;
var key = 1;

var key2 = 0;
console.log(localStorage.getItem(0));





function wait(ms) {
	var start = new Date().getTime();
	var end = start;
	while (end < start + ms) {
		end = new Date().getTime();
	}
}


function store(value, key) {
	localStorage.setItem(value, key);

}



var getRowSibling = new Promise((resolve, reject) => {
  smartsheet.sheets.getRow(options, function(err,row){
  	resolve(row.siblingId);
  })
});


getRowSibling.then((successMessage) => {
  console.log("Yay! " + successMessage);
});


















//TEST(options, startrow);


function TEST(options, startrow) {

	smartsheet.sheets.getRow(options, function(err, row) {
		if (err) {
			console.log(err)
			wait(60000)
		}
		console.log('STEP1')
		console.log(startrow)
		smartsheet.sheets.getCellHistory(options, function(err, cell) {
			if (err) {

				console.error(err)
				wait(60000);

			}
			console.log('STEP2')
			if (typeof cell == 'undefined') {
				console.log('Fin de la page')
				process.exit(1)
			}

			if (typeof cell.data[0] !== 'undefined') {
				var ticketnumber = cell.data[0].value

			} else {
				var ticketnumber = 'NO TICKET'
			}

			if (typeof row !== 'undefined') {
				startrow = row.siblingId

			} else {
				console.log("BIG ISSUE")
				process.exit(1)
			}

			jira.findIssue(ticketnumber, function(err, issue) {
				if (err) console.error(err);
				if (typeof issue !== 'undefined') {
					status = issue.fields.status.name;
					localStorage.setItem(status, key);
				} else {
					status = 'NA'
					localStorage.setItem(status, key);
				}

				//console.log(issue)

				console.log(startrow)
				var options = {
					sheetId: 900510493501316,
					rowId: startrow,
					columnId: 8131883654506372
				};
		
				console.log(options)
				console.log(ticketnumber)
				console.log(status)
				key++;
				console.log(key)
				TEST(options, startrow);
			})


		})
	})

}









function getCellValue(rowOptions, valueId, storageId) {
	var options = rowOptions;
	var valueId = valueId;
	var promiseTicketId = async(function*(next) {
		var number = 10;
		while (number <= 10) {
			number++;
			return smartsheet.sheets.getCellHistory(options)
		}
	})
	var APITicketId = async(function*(next) {
		return yield promiseTicketId()
	})

	var TEST = APITicketId().then(function(history) {
		console.log(history)
		localStorage.setItem(1, history.data[valueId].value)
	})

}



var promiseSiblingId = async(function*(next) {
	return smartsheet.sheets.getRow(options)
})
var APISiblingId = async(function*(next) {
	return yield promiseSiblingId()
})


function getSiblingId(options) {
	smartsheet.sheets.getRow(options)
		.then(function(row) {
			console.log(row.siblingId);
		})
		.catch(function(error) {
			console.log(error);
		});
}