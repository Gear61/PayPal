To run my application, run “node index.js” in whatever directory you extracted my code to.

The server will start listening on port 8888. Navigate to localhost:8888/paypal to get started.

Design notes:
1) Can’t support currency symbols since (to the best of my knowledge) a free openexchangerates.org account doesn’t let me do so
2) Checking the “Fresh Rate” checkbox in the currency conversion/rate forms makes my currency module pull data from the API instead of the cache file
3) I implemented very basic input checking. Blank inputs are turned down along with invalid country codes. I used HTML 5 to force the “Amount” field of the currency conversion form to only take in numeric inputs
