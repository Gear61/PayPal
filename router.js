var url = require("url");

function route(handle, pathname, response, requestURL)
{
	console.log("About to route a request for " + pathname);
	if (typeof handle[pathname] === 'function')
	{
		var url_parts = url.parse(requestURL, true);
		var query = url_parts.query;
		handle[pathname](response, query);
	}
	else
	{
		console.log("No request handler found for " + pathname);
		response.writeHead(404,
		{
			"Content-Type" : "text/plain"
		});
		response.write("404 - Not Found");
		response.end();
	}
}

exports.route = route;