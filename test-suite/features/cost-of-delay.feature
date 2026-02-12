Feature: Cost of Delay computations

  @calculation
  Scenario: Standard profile basic calculation
    Given a weekly value of 100000
    And the development length is 10 weeks
    And the delay is 4 weeks
    And urgency profile is "standard"
    When I calculate cost of delay
    Then total cost of delay should be 400000

  @calculation
  Scenario: Error when development weeks is zero
    Given a weekly value of 100000
    And the development length is 0 weeks
    And the delay is 4 weeks
    And urgency profile is "standard"
    When I calculate cost of delay
    Then an error should be thrown containing "developmentWeeks must be greater than zero"

  @calculation
  Scenario: Expedited profile has higher early losses
    Given a weekly value of 100000
    And the development length is 10 weeks
    And the delay is 5 weeks
    And urgency profile is "expedite"
    When I calculate cost of delay
    Then total cost of delay should be greater than 400000

  @ui
  Scenario: Invalid form inputs show inline error
    Given I open the Cost of Delay calculator
    And I set weekly value to ""
    And I set development weeks to 0
    And I set delay weeks to 2
    When I click calculate
    Then I should see an error message containing "greater than 0"

  @ui
  Scenario: Negative fields are highlighted
    Given I open the Cost of Delay calculator
    And I set weekly value to "50000"
    And I set development weeks to 5
    And I set delay weeks to -1
    And I set weekly value to "50000"
    When I click calculate
    Then I should see an error message containing "cannot be negative"