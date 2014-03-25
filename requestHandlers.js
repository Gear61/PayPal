"use strict";

var fs = require('fs');
var FileReader = require("./FileReader");
var RateServer = require("./RateServer");
var TransactionServer = require("./TransactionServer");

// HTML file paths
var MAIN_MENU = './HTML/MainMenu.html';
var CURRENCY_CONVERSION_FORM = './HTML/ConvertCurrency.html';
var GET_RATE_FORM = './HTML/GetRate.html';

// Returns the HTML response
function renderHTML(body, response)
{
	response.writeHead(200,
	{
		"Content-Type" : "text/html"
	});
	response.write(body);
	response.end();
}

// Loads main menu
function showMenu(response, query)
{
	FileReader.fetchFileContents(MAIN_MENU,
		function(body)
		{
		    renderHTML(body, response);
		});
}

// Load currency conversion form
function ccForm(response, query)
{
	FileReader.fetchFileContents(CURRENCY_CONVERSION_FORM,
		function(body)
		{
			renderHTML(body, response);
		});
}

// Load rate fetching form
function rateForm(response, query)
{
	FileReader.fetchFileContents(GET_RATE_FORM,
		function(body)
		{
			renderHTML(body, response);
		});
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