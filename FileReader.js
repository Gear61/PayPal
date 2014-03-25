var fs = require('fs');

// Simply reads in the content of the file with the given path
// and returns its contents
function fetchFileContents(path, callback)
{
	// Check for file existence first, then perform a read if it exists
	fs.exists(path, function(exists)
	{
		if (exists)
		{
			fs.readFile(path, {encoding: 'utf-8'},
				function(err, data)
				{
					if (!err)
				    {
				    	callback(data);
				    }
				    else
				    {
					   	console.log(err);
				    	callback("404 - The file at " + path + " was inaccessible.");
				    }
				});
		}
		else
		{
			callback("404 - The file at " + path + " was not found.");
		}
	});
}

exports.fetchFileContents = fetchFileContents;