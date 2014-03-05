// Equivalent of imports
var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

// Path to handler mappings
var handle = {};
handle["/paypal"] = requestHandlers.showMenu;
handle["/paypal/ccForm"] = requestHandlers.ccForm;
handle["/paypal/rateForm"] = requestHandlers.rateForm;
handle["/paypal/currencyConversion"] = requestHandlers.currencyConversion;
handle["/paypal/conversionRate"] = requestHandlers.conversionRate;

server.start(router.route, handle);