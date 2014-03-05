var RateServer = require("./RateServer");
var exec = require("child_process").exec;

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

function currencyConversion(response, query)
{
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
				'<head><title>Get Conversion Rate</title></head>' + 
				'<body bgcolor=white>' +
				'<h1>Currency Conversion</h1>' + 
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
				'<head><title>Get Conversion Rate</title></head>' + 
				'<body bgcolor=white>' +
				'<h1>Currency Conversion</h1>' + 
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
exports.currencyConversion = currencyConversion;
exports.conversionRate = conversionRate;