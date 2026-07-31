Buffett Portfolio Analyzer

A vanilla HTML/CSS/JavaScript calculator that estimates a target price per share for companies in Berkshire Hathaway's portfolio, using Warren Buffett's owner earnings (discounted cash flow) method.


Live Demo

https://hguimaray.github.io/buffett-portfolio-analyzer/


Problem

Estimating a fair "buy below" price for a stock using Buffett's owner earnings method normally requires manually working through several nested formulas — projecting owner earnings forward, discounting them back to the present, calculating a terminal value, and applying a margin of safety. Doing this by hand (or in a scratch spreadsheet) for every company is slow and error-prone, especially when pulling figures like operating cash flow and CapEx from sources like Yahoo Finance, which show numbers in shorthand (e.g. 5B, 800M) that are easy to mistype as full digits.


Value

This calculator narrows the scope to companies already in Berkshire Hathaway's portfolio — long-established, stable businesses — which makes it reasonable to fix several inputs (growth rate, discount rate, terminal growth rate, margin of safety) as constants instead of asking the user to estimate them each time. That leaves only three real-world inputs to gather (diluted average shares, operating cash flow, and CapEx), turning a multi-step manual calculation into a quick, repeatable lookup — with guidance on exactly where to find each number on Yahoo Finance.


Project Plan

The assignment's requirements limited the stack to HTML, CSS, and JavaScript, so the plan was to build a plain page with no frameworks or build tools, working through the stack in a deliberate order — HTML first, then JavaScript, then CSS — adjusting earlier files later on if a later step uncovered something that needed changing.

Before any code was written, significant time went into working out the owner earnings / intrinsic value formulas by hand. Those formulas were written out on paper first and then handed to Claude as the framework for the whole project, so every function in the codebase maps directly back to a specific piece of that handwritten math.

Breaking the formulas into small, individual functions (one per step: owner earnings, present value summation, terminal value, intrinsic value, target price) was a deliberate choice made from the very beginning, drawing on Python programming experience where splitting complex work into functions is standard practice for keeping code easy to debug and follow. That was especially useful here since several formulas feed directly into one another. Part of the motivation was also curiosity about how an AI would approach breaking down a layered formula like this — it followed the intended structure from the start.

To confirm the calculator was actually correct (not just running without errors), its output was tested against real figures for several companies from the Berkshire Hathaway portfolio and cross-checked against the same calculations solved by hand, to verify the results matched.



Features

Complete:

Three-input form: diluted average shares, operating cash flow, CapEx
Accepts shorthand suffixes (K / M / B) alongside full numbers, so units entered inconsistently (e.g. one field in billions, another in millions) don't throw off the calculation
Per-field inline validation with specific error messages (required field, invalid/unsupported format, shares must be greater than zero)
Fixed, documented constants for growth rate (4%), terminal growth rate (2.5%), discount rate (10%), margin of safety (10%), and a 10-year projection period
Displays owner earnings per share, intrinsic value per share, and the final target price per share
"Evaluate another company" button that resets the form and results for a new run
Guidance in-page on exactly where to find each input on Yahoo Finance


Possible next steps:

A way to derive a suggested growth rate from a company's own historical cash flow data instead of using a fixed 4% for every company
Side-by-side comparison of multiple companies
Saving/exporting past calculations
Sensitivity analysis (e.g. showing target price across a range of growth or discount rates)


Technologies Used
HTML5
CSS3
JavaScript (vanilla, no frameworks or libraries)

AI Tools Used
Claude (Anthropic) — used throughout the project to translate the handwritten owner earnings formulas into working code (structured into small, single-purpose functions per the author's own plan), reason through input validation edge cases (e.g. unit mismatches from shorthand suffixes, divide-by-zero protection), and design the visual styling.


Running the Project

Open the live demo link above: https://hguimaray.github.io/buffett-portfolio-analyzer/ No setup, downloads, or installation needed.


Open the live demo link above: https://hguimaray.github.io/buffett-portfolio-analyzer/ No setup, downloads, or installation needed.
