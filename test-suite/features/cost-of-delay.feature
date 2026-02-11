# ============================================================================
# COMPREHENSIVE END-TO-END BDD TEST SUITE
# Cost of Delay Calculator
# ============================================================================
# Purpose: Validate every single feature, button, calculation, and workflow
# Coverage: 100% of user interactions and system behaviors
# Test Approach: Given-When-Then (Gherkin BDD)
# ============================================================================

Feature: Cost of Delay Calculator - Complete End-to-End Testing
  As a business decision maker (CFO, CMO, COO, Product Manager)
  I want a reliable and accurate Cost of Delay calculator
  So that I can make data-driven prioritization decisions with confidence

  Background:
    Given the Cost of Delay calculator is loaded in a browser
    And the page renders without errors
    And all JavaScript is properly initialized
    And all event listeners are attached
    And all fields are cleared to default state

  Scenario: Calculate basic Cost of Delay with standard urgency
    Given I am analyzing a project called "Mobile Checkout"
    And the weekly value is "$100,000"
    And the development duration is "10" weeks
    And the delay period is "4" weeks
    And the urgency profile is "standard"
    When I calculate the cost of delay
    Then the total cost of delay should be "$400,000"
    And the CD3 value should be "$40,000" per week
    And the opportunity cost percentage should be calculated
    And the results should display negative values in red with parentheses

  Scenario: Calculate Cost of Delay with employee costs
    Given I am analyzing a project called "API Integration"
    And the weekly value is "$50,000"
    And the development duration is "8" weeks
    And the delay period is "3" weeks
    And I select hourly rate input type
    And the hourly rate is "$75"
    And the team size is "5" people
    And the FTE fully loaded cost multiplier is "1.5"
    When I calculate the cost of delay
    Then the total cost of delay should be calculated
    And the employee cost during delay should be calculated
    And the total economic impact should combine both costs
    And the hourly rate should be displayed as "$75.00/hr"
    And the team daily burn rate should be shown
    And the team weekly burn rate should be shown

  Scenario: Calculate Cost of Delay with expedite urgency profile
    Given I am analyzing a project called "Security Patch"
    And the weekly value is "$200,000"
    And the development duration is "4" weeks
    And the delay period is "2" weeks
    And the urgency profile is "expedite"
    When I calculate the cost of delay
    Then the cost should decrease exponentially over time
    And the peak weekly loss should be higher than standard
    And the visualization should show exponential decay

  Scenario: Calculate Cost of Delay with fixed date urgency
    Given I am analyzing a project called "Holiday Campaign"
    And the weekly value is "$150,000"
    And the development duration is "12" weeks
    And the delay period is "6" weeks
    And the urgency profile is "fixed-date"
    When I calculate the cost of delay
    Then the cost should spike after the deadline
    And severe penalties should be applied post-deadline

  Scenario: Convert annual salary to hourly rate
    Given I select annual salary input type
    And the annual salary is "$120,000"
    When the system calculates the hourly rate
    Then the hourly rate should be "$57.69" per hour
    And the calculation should use 2080 work hours per year

  Scenario: Apply FTE fully loaded cost multiplier
    Given the annual salary is "$100,000"
    And the FTE fully loaded cost multiplier is "1.5"
    When the true cost is calculated
    Then the true annual cost should be "$150,000"
    And this should account for benefits, insurance, and overhead

  Scenario: Compare multiple projects
    Given I have calculated "Project A" with CD3 of "$50,000"
    And I add it to comparison
    And I have calculated "Project B" with CD3 of "$75,000"
    And I add it to comparison
    And I have calculated "Project C" with CD3 of "$30,000"
    And I add it to comparison
    When I view the comparison table
    Then projects should be sorted by CD3 in descending order
    And "Project B" should be ranked #1
    And "Project A" should be ranked #2
    And "Project C" should be ranked #3
    And the top priority should be highlighted in green
    And the comparison chart should display all projects

  Scenario: Export results to CSV
    Given I have calculated a project
    When I export to CSV
    Then a CSV file should be downloaded
    And it should contain all project metrics
    And it should include headers
    And numeric values should be properly formatted

  Scenario: Export results to Excel
    Given I have calculated a project
    When I export to Excel
    Then an Excel file should be downloaded
    And it should contain formatted tables
    And negative values should be in red with parentheses
    And priority rankings should be color-coded

  Scenario: Export results to JSON
    Given I have calculated a project
    When I export to JSON
    Then a JSON file should be downloaded
    And it should contain complete calculation data
    And it should include timestamp
    And it should be valid JSON format

  Scenario: Print professional report
    Given I have calculated a project
    When I trigger print
    Then the print view should hide input forms
    And the print view should hide buttons
    And the print view should show only results and charts
    And the layout should be printer-friendly

  Scenario: Display tooltips for user guidance
    Given I am viewing the calculator
    When I hover over the information icon for "Weekly Value"
    Then a tooltip should appear
    And it should explain "Expected revenue gain or cost savings per week once delivered"
    And the tooltip should be clearly visible
    And the tooltip should disappear when I move away

  Scenario: View CMO perspective text output
    Given I have calculated a project with significant delay
    When I view the CMO perspective
    Then I should see market impact analysis
    And I should see competitive positioning risks
    And I should see customer satisfaction impacts
    And I should see brand perception risks

  Scenario: View CFO perspective text output
    Given I have calculated a project with significant delay
    When I view the CFO perspective
    Then I should see total economic impact
    And I should see cash flow implications
    And I should see ROI analysis
    And I should see opportunity cost breakdown

  Scenario: View COO perspective text output
    Given I have calculated a project with significant delay
    When I view the COO perspective
    Then I should see operational efficiency impacts
    And I should see resource utilization analysis
    And I should see capacity planning implications
    And I should see process bottleneck identification

  Scenario Outline: Validate input fields
    Given I am entering project data
    When I enter "<field>" with value "<value>"
    Then the field should accept valid values
    And the field should reject invalid values
    And appropriate error messages should display

    Examples:
      | field              | value    |
      | weeklyValue        | 100000   |
      | developmentWeeks   | 10       |
      | delayWeeks         | 4        |
      | annualSalary       | 120000   |
      | hourlyRate         | 75       |
      | teamSize           | 5        |
      | benefitsMultiplier | 1.5      |

  Scenario: Handle edge cases
    Given I enter extreme values
    When weekly value is "$1,000,000"
    And delay is "52" weeks
    Then calculations should remain accurate
    And formatting should handle large numbers
    And no overflow errors should occur

  Scenario: Accessibility compliance
    Given I am using assistive technology
    When I navigate the calculator
    Then all form fields should have proper labels
    And tooltips should be keyboard accessible
    And focus indicators should be visible
    And color should not be the only indicator

  # Reliability Scenarios
  Scenario: System remains stable with rapid calculations
    Given I am performing multiple calculations
    When I calculate 10 projects in quick succession
    Then all calculations should complete successfully
    And no memory leaks should occur
    And performance should remain consistent

  # Interoperability Scenarios
  Scenario: Cross-browser compatibility
    Given I open the calculator in different browsers
    When I perform calculations in Chrome, Firefox, Safari, and Edge
    Then results should be identical across all browsers
    And formatting should be consistent
    And exports should work in all browsers

  # Scalability Scenarios
  Scenario: Handle large comparison datasets
    Given I have added 50 projects to comparison
    When I view the comparison table
    Then all projects should display correctly
    And sorting should remain fast
    And the chart should render without lag
    And export functions should handle all data

  # Observability Scenarios
  Scenario: Track calculation history
    Given I perform multiple calculations
    When I review my activity
    Then I should be able to see previous calculations
    And I should see timestamps for each calculation
    And I should be able to track changes over time
