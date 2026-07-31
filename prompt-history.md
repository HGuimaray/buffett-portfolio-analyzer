HTML SECTION:
This project is about creating a target price per share of a company using Warren Buffett's method.
To keep this project simpler, I narrow the scope to just evaluating companies in Berkshire Hathaway portfolio.
Attached are the formulas needed for this. Just acknowledge.

This narrowed set up of portfolio allowed me to set some values as constants. Given this, this project is a vanilla html page.
css and javascript will also be used for this project. We will work on html, javascript and css in that order.
Create an index.html page with a basic calculator format.
Only 3 values will be needed from the user: 
Diluted average shares 
Operating Cash Flow Capital Expenditures or just label it CapEx since that is how it is shown on yahoo finance.

Good. Add a brief description explaining the purpose of this calculator and the margin of safety is set to 10% and the growth rate to 4%.
I am setting this as constants to simplify the calculator since the growth should be determined looking at the financials for the last 10 years.
Since the companies are in Berkshire's portfolio, they are known to be long established stable companies, therefore my MoS is 10% not 25% for example.

Also since we want to make this easier to the user, add a brief description where to find the needed values on yahoo finance.

explain why you are using the span tags?

JAVASCRIPT SECTION:
now let's work on the javascript file. First give me your proposed layout using TODO comments for this project

I wanted to break it down in functions since it is easier to debug and to follow along. We use a lot of formulas that are part of another formula and so on. Regarding the summation, use a for loop.
Do this first, then we I need you to explain further both options for validation errors

is this validation control also for the B or M suffixes? I am concerned the user might enter those values and throw off the calculations.
Note that if the input values have the same suffixes, they cancel each other out but what if the numerator is in billions and the numerator is in millions.
Furthermore another validation must be made so the denominator can not be equal to zero.

option 1 seems best since we still want to make this user friendly plus having the user enter the whole number manually might be worse because it is prone to have more errors by adding or missing zeros.
When validating, force the user to use the format with no spaces such as 5B instead of 5 B. Show the format or include this example so the user knows to omit the space

add comments to the index.html file explaining the new lines are error messages

CSS SECTION:
now I guess the easy part. Create the css file for this
Looks good, you forgot to include the 2.5% constant (the terminal growth rate) on the html file. I used this because its range is usually between 2% to 3%.
i want to add a button asking the user if he wants to evaluate another company again. 
The object being when he clicks the buttons, the boxes in the form will reset to blank waiting for new inputs
