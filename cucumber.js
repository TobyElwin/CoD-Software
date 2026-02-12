module.exports = {
  default: [
    "test-suite/features/smoke.feature",
    "--require test-suite/support/hooks.js",
    "--require test-suite/steps/**/*.js"
  ].join(" ")
};
