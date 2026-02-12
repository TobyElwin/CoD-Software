module.exports = {
  default: [
    "test-suite/features/**/*.feature",
    "--require test-suite/support/hooks.cjs",
    "--require test-suite/steps/**/*.cjs"
  ].join(" ")
};
