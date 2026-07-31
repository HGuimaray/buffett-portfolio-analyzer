// =========================================================
// Target Price Calculator — script.js
// =========================================================

// ---------------------------------------------------------
// 1. CONSTANTS
// ---------------------------------------------------------
const GROWTH_RATE = 0.04;             // g
const DISCOUNT_RATE = 0.10;           // d
const PERPETUAL_GROWTH_RATE = 0.025;  // g_perp
const MARGIN_OF_SAFETY = 0.10;        // MoS
const GROWTH_PERIOD_YEARS = 10;       // m

// Multipliers for shorthand suffixes, so every input converts to the same
// base unit (raw dollars / raw share count) before any math is done.
// This is what prevents a "5B" vs "800M" mismatch from throwing off the calculation.
const SUFFIX_MULTIPLIERS = {
  K: 1e3,
  M: 1e6,
  B: 1e9,
};


// ---------------------------------------------------------
// 2. DOM REFERENCES
// ---------------------------------------------------------
const form = document.getElementById('calculator-form');

const dilutedSharesInput = document.getElementById('diluted-shares');
const operatingCashFlowInput = document.getElementById('operating-cash-flow');
const capexInput = document.getElementById('capex');

const dilutedSharesError = document.getElementById('diluted-shares-error');
const operatingCashFlowError = document.getElementById('operating-cash-flow-error');
const capexError = document.getElementById('capex-error');

const resultsSection = document.getElementById('results');
const resultOE0 = document.getElementById('result-oe0');
const resultIV = document.getElementById('result-iv');
const resultTarget = document.getElementById('result-target');


// ---------------------------------------------------------
// 3. INPUT HANDLING / VALIDATION
// ---------------------------------------------------------

// Parses a raw input string into a plain number, expanding any K/M/B suffix
// to its full value. Accepts optional commas and whitespace.
// Examples: "5B" -> 5000000000, "800M" -> 800000000, "1,234,000,000" -> 1234000000
// Returns NaN if the string doesn't match a recognizable number/suffix format.
function parseSuffixedNumber(rawValue) {
  if (typeof rawValue !== 'string') {
    return NaN;
  }

  const cleaned = rawValue.trim().toUpperCase().replace(/,/g, '');

  // Matches an optional leading minus, digits, optional decimal, optional K/M/B suffix.
  // The suffix must sit directly against the number (e.g. "5B") — no space allowed
  // (e.g. "5 B" will NOT match and is correctly rejected as invalid).
  const match = cleaned.match(/^(-?\d+(?:\.\d+)?)([KMB]?)$/);

  if (!match) {
    return NaN;
  }

  const [, numberPart, suffix] = match;
  const baseValue = parseFloat(numberPart);
  const multiplier = suffix ? SUFFIX_MULTIPLIERS[suffix] : 1;

  return baseValue * multiplier;
}

// Reads the 3 form inputs and converts them to numbers (suffix-aware).
function getInputValues() {
  return {
    dilutedShares: parseSuffixedNumber(dilutedSharesInput.value),
    operatingCashFlow: parseSuffixedNumber(operatingCashFlowInput.value),
    capex: parseSuffixedNumber(capexInput.value),
  };
}

// Checks each parsed input and returns an object of field -> error message.
// A field with no error is omitted from the returned object.
// This (rather than a single true/false) is what lets us show the user
// exactly which field is wrong and why.
function validateInputs({ dilutedShares, operatingCashFlow, capex }) {
  const errors = {};

  if (dilutedSharesInput.value.trim() === '') {
    errors.dilutedShares = 'This field is required.';
  } else if (Number.isNaN(dilutedShares)) {
    errors.dilutedShares = 'Enter a number, optionally with a K/M/B suffix (e.g. 5B) — no space before the suffix.';
  } else if (dilutedShares <= 0) {
    // Diluted shares is the denominator in the OE0 formula — dividing by
    // zero (or a negative share count) must be blocked explicitly.
    errors.dilutedShares = 'Diluted shares must be greater than 0.';
  }

  if (operatingCashFlowInput.value.trim() === '') {
    errors.operatingCashFlow = 'This field is required.';
  } else if (Number.isNaN(operatingCashFlow)) {
    errors.operatingCashFlow = 'Enter a number, optionally with a K/M/B suffix (e.g. 5B) — no space before the suffix.';
  }

  if (capexInput.value.trim() === '') {
    errors.capex = 'This field is required.';
  } else if (Number.isNaN(capex)) {
    errors.capex = 'Enter a number, optionally with a K/M/B suffix (e.g. 800M) — no space before the suffix.';
  }

  return errors;
}

// Writes error messages into each field's error slot and clears any that
// no longer apply. Returns true if there were no errors at all.
function renderErrors(errors) {
  dilutedSharesError.textContent = errors.dilutedShares || '';
  operatingCashFlowError.textContent = errors.operatingCashFlow || '';
  capexError.textContent = errors.capex || '';

  return Object.keys(errors).length === 0;
}


// ---------------------------------------------------------
// 4. CORE CALCULATION FUNCTIONS
// ---------------------------------------------------------

// OE0 = (OCF - |CapEx|) / diluted shares
function calculateOE0(operatingCashFlow, capex, dilutedShares) {
  return (operatingCashFlow - Math.abs(capex)) / dilutedShares;
}

// OEt = OE0 * (1 + g)^t
function calculateOEt(oe0, growthRate, year) {
  return oe0 * Math.pow(1 + growthRate, year);
}

// Sums the discounted owner earnings for t = 1..m using a for loop.
// PV sum = Σ [ OEt / (1 + d)^t ]  for t = 1 to years
function calculatePresentValueOfOE(oe0, growthRate, discountRate, years) {
  let sum = 0;

  for (let t = 1; t <= years; t++) {
    const oeT = calculateOEt(oe0, growthRate, t);
    const discountedOeT = oeT / Math.pow(1 + discountRate, t);
    sum += discountedOeT;
  }

  return sum;
}

// OEm = OE0 * (1 + g)^m  (owner earnings at the end of the growth period)
function calculateOEm(oe0, growthRate, years) {
  return oe0 * Math.pow(1 + growthRate, years);
}

// TV = [ OEm * (1 + g_perp) ] / (d - g_perp)
function calculateTerminalValue(oeM, perpGrowthRate, discountRate) {
  return (oeM * (1 + perpGrowthRate)) / (discountRate - perpGrowthRate);
}

// IV = PV sum of OE + TV / (1 + d)^m
function calculateIntrinsicValue(sumPvOE, terminalValue, discountRate, years) {
  const discountedTerminalValue = terminalValue / Math.pow(1 + discountRate, years);
  return sumPvOE + discountedTerminalValue;
}

// Target Price = IV * (1 - MoS)
function calculateTargetPrice(intrinsicValue, marginOfSafety) {
  return intrinsicValue * (1 - marginOfSafety);
}


// ---------------------------------------------------------
// 5. ORCHESTRATION / MAIN HANDLER
// ---------------------------------------------------------

function handleFormSubmit(event) {
  event.preventDefault();

  const inputs = getInputValues();
  const errors = validateInputs(inputs);
  const isValid = renderErrors(errors);

  if (!isValid) {
    return;
  }

  // Step-by-step pipeline, each result feeding into the next formula.
  const oe0 = calculateOE0(inputs.operatingCashFlow, inputs.capex, inputs.dilutedShares);

  const sumPvOE = calculatePresentValueOfOE(oe0, GROWTH_RATE, DISCOUNT_RATE, GROWTH_PERIOD_YEARS);

  const oeM = calculateOEm(oe0, GROWTH_RATE, GROWTH_PERIOD_YEARS);

  const terminalValue = calculateTerminalValue(oeM, PERPETUAL_GROWTH_RATE, DISCOUNT_RATE);

  const intrinsicValue = calculateIntrinsicValue(sumPvOE, terminalValue, DISCOUNT_RATE, GROWTH_PERIOD_YEARS);

  const targetPrice = calculateTargetPrice(intrinsicValue, MARGIN_OF_SAFETY);

  renderResults({ oe0, iv: intrinsicValue, targetPrice });
}


// ---------------------------------------------------------
// 6. RENDER / OUTPUT
// ---------------------------------------------------------

// Formats a number as USD currency, e.g. 42.5 -> "$42.50"
function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

// Writes the calculated values into the results section and reveals it.
function renderResults({ oe0, iv, targetPrice }) {
  resultOE0.textContent = formatCurrency(oe0);
  resultIV.textContent = formatCurrency(iv);
  resultTarget.textContent = formatCurrency(targetPrice);

  resultsSection.hidden = false;
}


// ---------------------------------------------------------
// 7. EVENT LISTENERS / INIT
// ---------------------------------------------------------
form.addEventListener('submit', handleFormSubmit);
