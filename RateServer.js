var fs = require('fs');

var http = require("http");
var baseURL = 'http://openexchangerates.org/api/latest.json?app_id=';
var myID = 'f7964e7ee9ac43909deafb08d556e640';
var cachePath = './rates.txt';

// Convert error code from the getRate function into a string message
function codeToMessage(errorCode, countryCodeFROM, countryCodeTO, callback)
{
	if (errorCode == -1)
	{
		callback(countryCodeFROM + " is an invalid country code.");
	}
	else if (errorCode == -1.5)
	{
		callback(countryCodeTO + " is an invalid country code.");
	}
	else if (errorCode == -2)
	{
		callback("Cache file doesn't exist. Unable to consult.");
	}
}

function convertAmount(countryCodeFROM, Amount, countryCodeTO, fresh, callback)
{
	if (countryCodeFROM.trim() == '' || Amount.trim() == '' ||
		countryCodeTO.trim() == '')
	{
		callback("Please make sure that ALL inputs are non-blank.");
	}
	getRate(countryCodeFROM, countryCodeTO, fresh, function (conversionRate)
	{
		// Error received
		if (conversionRate == -1 || conversionRate == -1.5 || conversionRate == -2)
		{
			codeToMessage(conversionRate, countryCodeFROM, countryCodeTO,
						  function (message)
						  {
							  callback(message);
						  });
		}
		else
		{
			ToAmount = (conversionRate * parseFloat(Amount)).toFixed(2);
			callback(Amount + " " + countryCodeFROM + " is "
					 + ToAmount.toString() + " " + countryCodeTO);
		}
	});
}

function getConversionRate(countryCodeFROM, countryCodeTO, fresh, callback)
{
	if (countryCodeFROM.trim() == '' || countryCodeTO.trim() == '')
	{
		callback("Please make sure that ALL inputs are non-blank.");
	}
	getRate(countryCodeFROM, countryCodeTO, fresh, function(conversionRate)
	{
		// Error received
		if (conversionRate == -1 || conversionRate == -1.5 || conversionRate == -2)
		{
			codeToMessage(conversionRate, countryCodeFROM, countryCodeTO,
						  function (message)
						  {
							  callback(message);
						  });
		}
		else
		{
			callback("1 " + countryCodeFROM + " is "
					 + conversionRate.toFixed(2).toString() + " " + countryCodeTO);
		}
	});
}

function getRate(countryCode1, countryCode2, fresh, callback)
{
	// If we want fresh data, call fetchData and use its return value to
	// renew the file and grab the rates when it finishes
	if (fresh)
	{
		fetchData(function (conversionRates)
		{
			renewFile(conversionRates);
			rateA = conversionRates [countryCode1];
			rateB = conversionRates [countryCode2];
			if (typeof rateA === "undefined")
			{
				callback(-1);
			}
			else if (typeof rateB === "undefined")
			{
				callback(-1.5);
			}
			else
			{
				callback(rateB/rateA);
			}
		});
	}
	else
	{
		console.log("Consulting rates file.");
		// Get both rates, do math
		getRateFromFile(countryCode1, function(rateA)
		{
			if (rateA == -2 || rateA == -1)
			{
				callback(rateA);
			}
			else
			{
				getRateFromFile(countryCode2, function(rateB)
				{
					// We know now that the cache exists
					if (rateB == -1)
					{
						callback(-1.5);
					}
					else
					{
						callback(parseFloat(rateB)/parseFloat(rateA));
					}
				});
			}
		});
	}
}

function getRateFromFile(countryCode, callback)
{
	if (fs.existsSync(cachePath))
	{
	    // Get rate
		fs.readFile(cachePath, {encoding: 'utf-8'}, function(err, data)
		{
		    if (!err)
		    {
			    // We look for the pattern \n(COUNTRY_CODE) (space)
		    	if (data.indexOf('\n' + countryCode + ' ') == -1)
			    {
			    	callback(-1);
			    }
			    // If we find it, we split it what comes after it but before the new line, 
		    	// which is the rate we're interested in
		    	else
			    {
			    	callback((data.split(countryCode + " ")[1]).split('\n')[0]);
			    }
		    }
		    else
		    {
		        console.log(err);
		    }
		});
	}
	else
	{
		console.log("Cache doesn't exist.");
		callback(-2);
	}
}

// Uses the API to grab fresh conversion rates
function fetchData(callback)
{
	console.log("Getting fresh data.");
	var BODY = '';
	// Get conversion rates JSON, return to callback
	http.get(baseURL + myID, function(res)
	{
		res.on('data', function (chunk)
		{
		    BODY += chunk;
		});
		res.on('end', function (chunk)
		{
			callback((JSON.parse(BODY))['rates']);
		});
	}).on('error', function(e)
	{
		console.log("Got error: " + e.message);
	});
}

// Renews rates file given the rates JSON
function renewFile(conversionRates)
{
	fs.unlinkSync(cachePath);
	var fileContents = '';
	for (key in conversionRates)
	{
		fileContents += key + ' ';
		fileContents += (parseFloat(conversionRates[key]).toFixed(2)).toString();
		fileContents += '\n';
	}
	
	fs.writeFile(cachePath, fileContents, function(err)
	{
	    if(err)
	    {
	        console.log(err);
	    }
	    else
	    {
	        console.log("Rates file renewed!");
	    }
	});
}

exports.convertAmount = convertAmount;
exports.getRate = getRate;
exports.getConversionRate = getConversionRate;
exports.getRateFromFile = getRateFromFile;
exports.fetchData = fetchData;
exports.renewFile = renewFile;