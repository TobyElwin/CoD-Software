const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");
const {
  calculateCostOfDelay,
} = require('../../src/calculations.js');

const context = {};

// -------- calculation helpers (non-UI) --------
Given('a weekly value of {float}', function (value) {
  context.weekly = value;
});

Given('the development length is {int} weeks', function (weeks) {
  context.dev = weeks;
});

Given('the delay is {int} weeks', function (weeks) {
  context.delay = weeks;
});

Given('urgency profile is {string}', function (profile) {
  context.profile = profile;
});

When('I calculate cost of delay', function () {
  try {
    context.result = calculateCostOfDelay(
      context.weekly,
      context.dev,
      context.delay,
      context.profile
    );
  } catch (err) {
    context.error = err;
  }
});

Then('total cost of delay should be {float}', function (expected) {
  assert.strictEqual(context.result.totalCostOfDelay, expected);
});

Then('total cost of delay should be greater than {float}', function (threshold) {
  assert.ok(context.result.totalCostOfDelay > threshold, `expected ${context.result.totalCostOfDelay} > ${threshold}`);
});

Then('an error should be thrown containing {string}', function (substr) {
  assert.ok(context.error, 'expected an error to have been thrown');
  assert.ok(context.error.message.includes(substr), `error message "${context.error.message}" did not contain "${substr}"`);
});

// -------- UI interaction steps --------
Given('I set weekly value to {string}', async function (value) {
  await this.page.$eval('#weeklyValue', (el, v) => { el.value = v; }, value);
});

Given('I set development weeks to {int}', async function (weeks) {
  await this.page.$eval('#developmentWeeks', (el, v) => { el.value = v; }, weeks);
});

Given('I set delay weeks to {int}', async function (weeks) {
  await this.page.$eval('#delayWeeks', (el, v) => { el.value = v; }, weeks);
});

When('I click calculate', async function () {
  await this.page.click('#calculateBtn');
});

Then('I should see an error message containing {string}', async function (substr) {
  await this.page.waitForSelector('#errorMessage', { visible: true, timeout: 5000 });
  const txt = await this.page.$eval('#errorMessage', el => el.textContent);
  assert.ok(txt.includes(substr), `Error text "${txt}" did not include "${substr}"`);
});