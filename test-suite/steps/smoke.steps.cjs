const { Given, Then } = require("@cucumber/cucumber");
const assert = require("assert");

Given("I open the Cost of Delay calculator", async function () {
  await this.page.goto(`${this.baseUrl}/cost-of-delay-calculator.html`, { waitUntil: "networkidle2" });
});

Then("I should see a page header {string}", async function (expected) {
  await this.page.waitForSelector("h1", { timeout: 15000 });
  const text = await this.page.$eval("h1", (el) => (el.textContent || "").trim());
  assert.strictEqual(text, expected);
});
