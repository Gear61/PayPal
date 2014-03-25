var paypal_api = require('paypal-rest-sdk');

var myID = 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM';
var mySecret = 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM';

var config_opts =
{
	'host' : 'api.sandbox.paypal.com',
	'port' : '',
	'client_id' : myID,
	'client_secret' : mySecret
};

var listPayment =
{
	'count' : '15',
	'start_index' : '1'
};

// Upon fetchTransactionList returning a JSON, we parse that JSON into an 
// HTML table that we funnel back up to the requestHandler to display
function createTransactionsList(callback)
{
	fetchTransactionsList(function(transactions)
	{
		var BODY = '<table style="width:300px">';
		BODY += '<tr>';
		BODY += '<th>Date</th>';
		BODY += '<th>Intent</th>';
		BODY += '<th>Amount</th>';
		BODY += '<th>Description</th>';
		BODY += '</tr>';
		for (var i = 0; i < transactions.length; i++)
		{
			BODY += '<tr>';
			BODY += '<td>' + (transactions[i]['create_time'].split("T0"))[0] + '</td>';
			BODY += '<td>' + (transactions[i]['intent']) + '</td>';
			if (transactions[i]['transactions'].length != 0)
			{
				BODY += '<td>' + (transactions[i]['transactions'][0]['amount']['total']) + '</td>';
				var description = transactions[i]['transactions'][0]['description'];
				if (typeof description === "undefined")
				{
					description = "None";
				}
				BODY += '<td>' + description + '</td>';
			}
			else
			{
				BODY += '<td>Unknown</td>';
				BODY += '<td>None</td>';
			}
			BODY += '</tr>';
		}
		BODY += '</table>';
		callback(BODY);
	});
}

// Makes a call to the PayPal API to get recent transactions
function fetchTransactionsList(callback)
{	
	paypal_api.payment.list(listPayment, config_opts,
			function(get_err, get_res)
			{
				if (get_err)
				{
					throw get_res;
				}

				if (get_res)
				{
					console.log("Transactions List Response Received!");
					callback(get_res['payments']);
				}
			});
}

exports.createTransactionsList = createTransactionsList;
exports.fetchTransactionsList = fetchTransactionsList;