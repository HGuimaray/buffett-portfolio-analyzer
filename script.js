// =========================================================
// Target Price Calculator — script.js layout
// =========================================================

// ---------------------------------------------------------
// 1. CONSTANTS
// ---------------------------------------------------------
// TODO: Define fixed assumptions as named constants
//   - GROWTH_RATE = 0.04            (g)
//   - DISCOUNT_RATE = 0.10          (d)
//   - PERPETUAL_GROWTH_RATE = 0.025 (g_perp)
//   - MARGIN_OF_SAFETY = 0.10       (MoS)
//   - GROWTH_PERIOD_YEARS = 10      (m)


// ---------------------------------------------------------
// 2. DOM REFERENCES
// ---------------------------------------------------------
// TODO: Grab the form element (#calculator-form)
// TODO: Grab the 3 input fields (diluted-shares, operating-cash-flow, capex)
// TODO: Grab the results section (#results) and its value spans
//   (#result-oe0, #result-iv, #result-target)


// ---------------------------------------------------------
// 3. INPUT HANDLING / VALIDATION
// ---------------------------------------------------------
// TODO: Function to read + parse raw input values as numbers
// TODO: Function to validate inputs (e.g. shares > 0, required fields filled,
//       no negative diluted shares, etc.)
// TODO: Decide how to handle/display validation errors to the user


// ---------------------------------------------------------
// 4. CORE CALCULATION FUNCTIONS
// ---------------------------------------------------------
// TODO: calculateOE0(operatingCashFlow, capex, dilutedShares)
//       -> OE0 = (OCF - |CapEx|) / diluted shares

// TODO: calculateOEt(oe0, growthRate, year)
//       -> OEt = OE0 * (1 + g)^t

// TODO: calculatePresentValueOfOE(oe0, growthRate, discountRate, years)
//       -> sums OEt / (1+d)^t for t = 1..10 (loop or reduce)

// TODO: calculateOEm(oe0, growthRate, years)
//       -> OEm = OE0 * (1 + g)^m  (owner earnings at end of growth period)

// TODO: calculateTerminalValue(oeM, perpGrowthRate, discountRate)
//       -> TV = OEm * (1 + g_perp) / (d - g_perp)

// TODO: calculateIntrinsicValue(sumPvOE, terminalValue, discountRate, years)
//       -> IV = sumPvOE + TV / (1+d)^m

// TODO: calculateTargetPrice(intrinsicValue, marginOfSafety)
//       -> Target Price = IV * (1 - MoS)


// ---------------------------------------------------------
// 5. ORCHESTRATION / MAIN HANDLER
// ---------------------------------------------------------
// TODO: handleFormSubmit(event)
//       - preventDefault()
//       - read + validate inputs
//       - run calculation pipeline (OE0 -> PV sum -> TV -> IV -> target price)
//       - call render function with results
//       - handle/display errors if validation fails


// ---------------------------------------------------------
// 6. RENDER / OUTPUT
// ---------------------------------------------------------
// TODO: formatCurrency(value) -> consistent $ formatting (e.g. Intl.NumberFormat)
// TODO: renderResults({ oe0, iv, targetPrice })
//       - populate #result-oe0, #result-iv, #result-target
//       - unhide #results section
// TODO: (optional) resetResults() -> hide/clear results if form is edited again


// ---------------------------------------------------------
// 7. EVENT LISTENERS / INIT
// ---------------------------------------------------------
// TODO: form.addEventListener('submit', handleFormSubmit)
// TODO: (optional) input listeners to reset/hide results when user edits values
