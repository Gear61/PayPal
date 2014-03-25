"use strict";

var fs = require('fs');
var FileReader = require("./FileReader");
var RateServer = require("./RateServer");
var TransactionServer = require("./TransactionServer");

/* HTML file paths */
// FORMS
var MAIN_MENU = './HTML/MainMenu.html';
var CURRENCY_CONVERSION_FORM = './HTML/ConvertCurrencyForm.html';
var GET_RATE_FORM = './HTML/GetRate.html';

// RESPONSES
var TRANSACTIONS = './HTML/Transactions.html';
var CONVERTED_CURRENCY = './HTML/ConvertedCurrency.html';
var CONVERSION_RATE = './HTML/Rate.html';

// Given HTML and an HTTP response, this function will write the
// HTML to the response
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

// Displays recent PayPal transactions
function activity(response, query)
{
	TransactionServer.createTransactionsList(function(message)
	{
		FileReader.fetchFileContents(TRANSACTIONS,
			function(body)
			{
				renderHTML(body.replace("TRANSACTIONS GO HERE", message), response);
			});
	});
}

// Converts X amount of currency A into currency B
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
			FileReader.fetchFileContents(CONVERTED_CURRENCY,
				function(body)
				{
					renderHTML(body.replace("CONVERTED CURRENCY GOES HERE", message), response);
				});
		});
}

// Gives how many of Currency B can be obtained per unit of Currency A
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
			FileReader.fetchFileContents(CONVERSION_RATE,
				function(body)
				{
					renderHTML(body.replace("CONVERSION RATE GOES HERE", message), response);
				});
		});
}

exports.showMenu = showMenu;
exports.ccForm = ccForm;
exports.rateForm = rateForm;
exports.activity = activity;
exports.currencyConversion = currencyConversion;
exports.conversionRate = conversionRate;