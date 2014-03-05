To run my application, run “node index.js” in whatever directory you extracted my code to.

The server will start listening on port 8888. Navigate to localhost:8888/paypal to get started!

Design notes:
1) Can’t support currency symbols since (to the best of my knowledge) a free openexchangerates.org account doesn’t let me do so.

2) Checking the “Fresh Rate” checkbox in the currency conversion/rate forms makes my currency module pull data from the API instead of the cache file.

3) I implemented very basic input checking for the currency conversion functionalities. Blank inputs are turned down along with invalid country codes. I used HTML 5 to force the “Amount” field of the currency conversion form to only take in numeric inputs.

4) Due to major time crunch, I didn’t sandbox with my own PayPal webapp to generate a transactions list. Instead, I used the client ID and secret of some sample code I found online, using the returned JSON of that API call (this webapp has a lot of transactions to draw from apparently) to fuel the activity part of my webapp. The information I display is also a little different from what’s in the mockup.

5) Also due to major time crunch, I was unable to create a formal suite of test cases for this project. My development was still test-driven; though the testing was entirely manual.
