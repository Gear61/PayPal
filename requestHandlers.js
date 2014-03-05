"use strict";

var fs = require('fs');
var RateServer = require("./RateServer");
var TransactionServer = require("./TransactionServer");

function showMenu(response, query)
{
	var body = '<HTML>'
			+ '<HEAD>'
			+ '<TITLE>Main Page</TITLE>'
			+ '<META http-equiv=Content-Type content="text/html">'
			+ '</HEAD>'
			+ '<body>'
			+ '<p><H3>PayPal Webapp</H3><p>'
			+ '<ul>'
			+ '<li><a href="/paypal/activity">View Transaction History</a></li>'
			+ '<li><a href="/paypal/ccForm">Convert Currency</a></li>'
			+ '<li><a href="/paypal/rateForm">Get Conversion Rate</a></li>'
			+ '</ul>'
			+ '</body>'
			+ '</html>';

	response.writeHead(200,
	{
		"Content-Type" : "text/html"
	});
	response.write(body);
	response.end();
}

function ccForm(response, query)
{
	var body = '<html>' + 
	'<head><title>Convert Currency</title></head>' + 
	'<body bgcolor=white>' +
	'<h1>Convert Currency</h1>' + 
	'<form method=get action=/paypal/currencyConversion>' + 
	  '<table>' + 
	    '<tr>' + 
	      '<td align="right">From (Currency Code):</td>' + 
		  '<td align="left"><input type="text" name="fromCC" /></td>' + 
		'</tr>' + 
		'<tr>' + 
		  '<td align="right">Amount:</td>' + 
	      '<td align="left"><input type="number" name="amount" /></td>' + 
		'</tr>' + 
	    '<tr>' + 
	      '<td align="right">To (Currency Code):</td>' + 
	      '<td align="left"><input type="text" name="toCC" /></td>' + 
	    '</tr>' + 
		'<tr>' + 
	      '<td align="right"><input type=submit name=convert_currency value="Convert"></td>' +
	      '<td align="left"><input type="checkbox" name="fresh">Fresh Rates</td>' + 
	    '</tr>' + 
	  '</table>' + 
	'</form>' + 
	'</body>' + 
	'</html>';

	response.writeHead(200,
	{
		"Content-Type" : "text/html"
	});
	response.write(body);
	response.end();
}

function rateForm(response, query)
{
	var body = '<html>' + 
	'<head><title>Get Conversion Rate</title></head>' + 
	'<body bgcolor=white>' +
	'<h1>Get Conversion Rate</h1>' + 
	'<form method=get action=/paypal/conversionRate>' + 
	  '<table>' + 
	    '<tr>' + 
	      '<td align="right">Currency Code 1:</td>' + 
		  '<td align="left"><input type="text" name="fromCC" /></td>' + 
		'</tr>' + 
		'<tr>' + 
		  '<td align="right">Currency Code 2:</td>' + 
	      '<td align="left"><input type="text" name="toCC" /></td>' + 
		'</tr>' + 
		'<tr>' + 
	      '<td align="right"><input type=submit name=convert_currency value="Get Rate"></td>' + 
	      '<td align="left"><input type="checkbox" name="fresh">Fresh Rates</td>' + 
	    '</tr>' + 
	  '</table>' + 
	'</form>' + 
	'</body>' + 
	'</html>';

	response.writeHead(200,
	{
		"Content-Type" : "text/html"
	});
	response.write(body);
	response.end();
}

function activity(response, query)
{
	TransactionServer.createTransactionsList(function(message)
	{
		var body = '<html>'
				+ '<head><title>Transactions List</title>'
				+ '<style>'
				+ 'table,th,td'
				+ '{'
				+ 	'border:1px solid black;'
				+ 	'border-collapse:collapse;'
				+ '}'
				+ 	'th,td'
				+ '{'
				+ 	'padding:5px;'
				+ '}'
				+ '</style>'
				+ '</head>'
				+ '<body bgcolor=white>'
				+ '<h1>Transactions List</h1>'
				+ message
				+ '</body>'
				+ '</html>';

		response.writeHead(200,
		{
			"Content-Type" : "text/html"
		});
		response.write(body);
		response.end();
	});
}

function currencyConversion(response, query)
{
	var fresh;
	if (query['fresh'] == 'on')
	{
		fresh = true;
	}
	else
	{
		fresh = false;
	}
	RateServer.convertAmount(query['fromCC'], query['amount'], query['toCC'], fresh,
		  function(message)
		  {
				var body = '<html>' + 
				'<head><title>Converted Currency</title></head>' + 
				'<body bgcolor=white>' +
				'<h1>Converted Currency</h1>' + 
				message + 
				'</body>' + 
				'</html>';
		
				response.writeHead(200,
				{
					"Content-Type" : "text/html"
				});
				response.write(body);
				response.end();
		 });
}

function conversionRate(response, query)
{
	var fresh;
	if (query['fresh'] == 'on')
	{
		fresh = true;
	}
	else
	{
		fresh = false;
	}
	RateServer.getConversionRate(query['fromCC'], query['toCC'], fresh,
			function(message)
			{
				var body = '<html>' + 
				'<head><title>Conversion Rate</title></head>' + 
				'<body bgcolor=white>' +
				'<h1>Conversion Rate</h1>' + 
				message + 
				'</body>' + 
				'</html>';
			
				response.writeHead(200,
				{
					"Content-Type" : "text/html"
				});
				response.write(body);
				response.end();
			});
}

exports.showMenu = showMenu;
exports.ccForm = ccForm;
exports.rateForm = rateForm;
exports.activity = activity;
exports.currencyConversion = currencyConversion;
exports.conversionRate = conversionRate;