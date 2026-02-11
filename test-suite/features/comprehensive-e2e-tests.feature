# ============================================================================
# COMPREHENSIVE END-TO-END BDD TESTS - Cost of Delay Calculator
# ============================================================================

@critical @smoke
Feature: Application Initialization and Page Load
  Scenario: Calculator loads successfully
    Given I navigate to the Cost of Delay calculator URL
    When the page finishes loading
    Then I should see the page title "Cost of Delay Calculator"
    And I should see the header "Cost of Delay Calculator"
    And I should see the subtitle "Quantify the financial impact of project delays"
    And I should see the helper text with guidance
    And I should see "Project/Product Information" section
    And I should see "Team Cost Parameters" section
    And I should see "Estimate" section
    And I should see "Cost of Delay Analysis" section
    And all CSS styles should be loaded
    And all JavaScript should be loaded without errors
    
  Scenario: All input fields are present and accessible
    Given the calculator has loaded
    Then I should see an input field for "Project Name"
    And I should see an input field for "Target Launch Date"
    And I should see an input field for "Revised Launch Date"
    And I should see an input field for "Expected Revenue or Cost Savings Per Week"
    And I should see an input field for "Development Duration"
    And I should see an input field for "Delay Period"
    And I should see a dropdown for "Urgency Profile"
    And I should see a dropdown for "Salary Input Type"
    And I should see an input field for "Average Annual Salary"
    And I should see an input field for "Number of Team Members"
    And I should see an input field for "FTE Fully Loaded Cost"
    And all input fields should be enabled
    And all input fields should accept user input

@critical @buttons
Feature: Button Visibility and Functionality
  Scenario: Primary calculate button is visible and functional
    Given the calculator has loaded
    Then I should see a button labeled "Estimate Cost of Delay"
    And the button should be enabled
    And the button should have proper styling
    When I click the "Estimate Cost of Delay" button without entering data
    Then I should see a validation error message
    
  Scenario: Secondary action buttons appear after calculation
    Given I have entered valid project data
    When I click "Estimate Cost of Delay"
    Then I should see a button labeled "Add to Comparison"
    And I should see a button labeled "Save As..."
    And I should see a button labeled "Load From File"
    And all buttons should be enabled and clickable
    
  Scenario: Export buttons are accessible
    Given I have calculated a project
    When the results are displayed
    Then I should see an "Export" dropdown button
    When I click the Export dropdown
    Then I should see "Export as CSV" option
    And I should see "Export as Excel (.xls)" option
    And I should see "Export as JSON" option
    And all export options should be clickable
    
  Scenario: Generate Images button is functional
    Given I have calculated a project
    Then I should see a "Generate Images" button
    When I click "Generate Images"
    Then the system should respond with image generation functionality

@critical @calculation
Feature: Cost of Delay Calculations
  Scenario: Calculate basic CoD with standard urgency profile
    Given I enter the following project data:
      | Field                          | Value          |
      | Project Name                   | Mobile Checkout |
      | Weekly Value                   | 100000         |
      | Development Duration           | 10             |
      | Delay Period                   | 4              |
      | Urgency Profile                | standard       |
    When I click "Estimate Cost of Delay"
    Then the Total Cost of Delay should be "$400,000"
    And the CD3 value should be "$40,000" per week
    And the results should display in the "Cost of Delay Analysis" section
    And negative values should be displayed in red with parentheses
    And the Quick Stats section should display
    
  Scenario: Calculate CoD with employee costs
    Given I enter the following project data:
      | Field                          | Value          |
      | Project Name                   | API Integration |
      | Weekly Value                   | 50000          |
      | Development Duration           | 8              |
      | Delay Period                   | 3              |
      | Salary Type                    | hourly         |
      | Hourly Rate                    | 75             |
      | Team Size                      | 5              |
      | FTE Fully Loaded Cost          | 1.5            |
    When I click "Estimate Cost of Delay"
    Then the Total Cost of Delay should be calculated correctly
    And the Employee Cost During Delay should be displayed
    And the Total Economic Impact should combine both costs
    And the hourly rate should be "$75.00/hr"
    And the team daily burn rate should be shown
    And the team weekly burn rate should be shown
    And the Employee Cost Analysis section should be visible
    
  Scenario Outline: Test all urgency profiles
    Given I enter a project with "<profile>" urgency profile
    And the weekly value is "$100,000"
    And the delay is "5" weeks
    When I calculate the cost of delay
    Then the calculation should use the "<profile>" formula
    And the cost pattern should match "<expected_pattern>"
    
    Examples:
      | profile     | expected_pattern          |
      | standard    | linear                    |
      | expedite    | exponential_decay         |
      | fixed-date  | deadline_spike           |
      | intangible  | growing_over_time        |

@critical @validation
Feature: Input Validation and Error Handling
  Scenario: Prevent calculation without required fields
    Given the calculator is loaded
    When I click "Estimate Cost of Delay" without entering any data
    Then I should see an error message
    And the error should indicate "Please enter valid values for Weekly Value and Development Duration"
    
  Scenario: Validate numeric inputs accept only numbers
    Given I am on the calculator page
    When I enter "abc" in the "Weekly Value" field
    Then the input should not accept non-numeric characters
    And the field should remain empty or show "0"
    
  Scenario: Validate date fields auto-format correctly
    Given I am on the calculator page
    When I type "12252024" in the "Target Launch Date" field
    Then the field should auto-format to "12-25-2024"
    When I type "6152024" in the "Revised Launch Date" field
    Then the field should auto-format to "06-15-2024"
    
  Scenario: Validate negative numbers are not accepted in cost fields
    Given I am on the calculator page
    When I try to enter "-1000" in "Weekly Value"
    Then the input should prevent negative values
    Or the calculation should reject negative values

@critical @save-load
Feature: Save and Load Functionality
  Scenario: Save project state to JSON file
    Given I have calculated a project named "Test Project"
    When I click "Save As..."
    Then I should see a prompt for filename
    When I enter "my-project" as the filename
    Then a JSON file "my-project.json" should be downloaded
    And the file should contain all input values
    And the file should contain calculation results
    And the file should contain comparison projects
    And the file should contain a timestamp
    And I should see a confirmation message
    
  Scenario: Load project state from JSON file
    Given I have a previously saved project file "my-project.json"
    When I click "Load From File"
    And I select the file "my-project.json"
    Then all input fields should be populated with saved values
    And the salary type toggle should be set correctly
    And comparison projects should be restored
    And the calculation should run automatically
    And I should see a success confirmation message
    
  Scenario: Validate file format on load
    Given I am on the calculator page
    When I click "Load From File"
    And I select an invalid file "invalid.txt"
    Then I should see an error message
    And the message should indicate "Invalid file format"
    And no fields should be populated

@critical @export
Feature: Export Functionality
  Scenario: Export results to CSV
    Given I have calculated a project
    When I click the "Export" dropdown
    And I click "Export as CSV"
    Then a CSV file should be downloaded
    And the CSV should contain headers
    And the CSV should contain all project metrics
    And numeric values should be properly formatted
    And the file should be compatible with Excel and Google Sheets
    
  Scenario: Export results to Excel
    Given I have calculated a project
    When I click "Export as Excel (.xls)"
    Then an Excel file should be downloaded
    And the file should contain formatted tables
    And negative values should be in red with parentheses
    And priority rankings should be color-coded
    And the file should open in Microsoft Excel
    
  Scenario: Export results to JSON
    Given I have calculated a project
    When I click "Export as JSON"
    Then a JSON file should be downloaded
    And the JSON should contain complete calculation data
    And the JSON should include a timestamp
    And the JSON should be valid JSON format

@critical @comparison
Feature: Project Comparison
  Scenario: Add multiple projects to comparison
    Given I have calculated "Project A" with CD3 of "$50,000"
    When I click "Add to Comparison"
    Then "Project A" should be added to the comparison list
    When I calculate "Project B" with CD3 of "$75,000"
    And I click "Add to Comparison"
    Then "Project B" should be added to the comparison list
    When I calculate "Project C" with CD3 of "$30,000"
    And I click "Add to Comparison"
    Then "Project C" should be added to the comparison list
    
  Scenario: Projects are sorted by CD3 priority
    Given I have added 3 projects to comparison
    When I view the comparison table
    Then projects should be sorted by CD3 in descending order
    And "Project B" should be ranked #1
    And "Project A" should be ranked #2
    And "Project C" should be ranked #3
    And the top priority should be highlighted in green
    
  Scenario: Remove individual project from comparison
    Given I have 3 projects in comparison
    When I click the "×" button next to "Project B"
    Then "Project B" should be removed from the list
    And the remaining projects should be re-ranked
    
  Scenario: Clear all projects from comparison
    Given I have multiple projects in comparison
    When I click "Clear All"
    Then I should see a confirmation dialog
    When I confirm the action
    Then all projects should be removed
    And the comparison section should be hidden

@critical @executive-perspectives
Feature: Executive Perspectives
  Scenario: CFO perspective displays financial analysis
    Given I have calculated a project with significant delay
    When the results are displayed
    Then I should see "Executive Impact Analysis" section
    And the "CFO Perspective" tab should be active by default
    And I should see "Financial Impact Summary"
    And I should see "Cash Flow Implications"
    And I should see "Opportunity Cost Analysis"
    And I should see "ROI Impact"
    And I should see "CFO Recommendation"
    
  Scenario: CMO perspective displays market analysis
    Given I have calculated a project
    When I click the "CMO Perspective" tab
    Then the CMO tab should become active
    And I should see "Market & Brand Impact"
    And I should see "Competitive Positioning Risks"
    And I should see "Customer Satisfaction & Retention"
    And I should see "Brand Perception & Market Momentum"
    And I should see "CMO Recommendation"
    
  Scenario: COO perspective displays operational analysis
    Given I have calculated a project
    When I click the "COO Perspective" tab
    Then the COO tab should become active
    And I should see "Operational Efficiency Impact"
    And I should see "Resource Utilization Analysis"
    And I should see "Capacity Planning Implications"
    And I should see "Process & Flow Optimization"
    And I should see "COO Recommendation"

@critical @responsive
Feature: Responsive Design
  Scenario: Four-column layout on large desktop
    Given I am viewing the calculator on a screen width of 1600px or greater
    Then I should see 4 columns side by side
    And column 1 should be "Project/Product Information"
    And column 2 should be "Team Cost Parameters"
    And column 3 should be "Estimate"
    And column 4 should be "Cost of Delay Analysis"
    And all columns should be visible without scrolling horizontally
    
  Scenario: Two-column layout on laptop
    Given I am viewing the calculator on a screen width between 1200px and 1599px
    Then I should see 2 columns for inputs
    And the Estimate section should be below inputs
    And results should be in a 2-column grid
    
  Scenario: Single-column layout on mobile
    Given I am viewing the calculator on a screen width less than 768px
    Then all sections should be stacked vertically
    And inputs should be full width
    And buttons should be full width
    And the layout should be optimized for touch input

@critical @ui-ux
Feature: User Interface and Experience
  Scenario: Tooltips provide helpful information
    Given I am on the calculator page
    When I hover over the "ⓘ" icon next to "Weekly Value"
    Then a tooltip should appear
    And the tooltip should explain the field purpose
    And the tooltip should be clearly readable
    When I move the mouse away
    Then the tooltip should disappear
    
  Scenario: Quick Stats display after calculation
    Given I have calculated a project
    Then the Quick Stats section should be visible
    And I should see "Total CoD" with a value
    And I should see "CD3 Priority" with a value
    And I should see "Economic Impact" with a value
    And all values should be properly formatted
    And negative values should be in red parentheses
    
  Scenario: Header is compact for above-the-fold optimization
    Given I am on the calculator page
    Then the header height should be minimized
    And the header should use compact padding
    And maximum screen space should be available for inputs
    And the most important content should be visible without scrolling

@critical @data-integrity
Feature: Data Integrity and Calculations
  Scenario: Calculations remain consistent across sessions
    Given I calculate a project with specific inputs
    And I note the results
    When I refresh the page
    And I enter the same inputs
    And I calculate again
    Then the results should be identical
    
  Scenario: Large numbers are handled correctly
    Given I enter a weekly value of "$1,000,000"
    And I enter a delay of "52" weeks
    When I calculate
    Then the result should be "$52,000,000"
    And the formatting should handle large numbers correctly
    And no overflow errors should occur
    
  Scenario: Decimal values are calculated accurately
    Given I enter an hourly rate of "$65.50"
    When I calculate employee costs
    Then the annual salary should be "$136,240"
    And decimal precision should be maintained

@critical @accessibility
Feature: Accessibility and Usability
  Scenario: All buttons are keyboard accessible
    Given I am on the calculator page
    When I navigate using the Tab key
    Then I should be able to focus on all interactive elements
    And the focus indicator should be clearly visible
    And I should be able to activate buttons using Enter or Space
    
  Scenario: Form labels are properly associated
    Given I am on the calculator page
    Then all input fields should have associated labels
    And labels should be linked to inputs using "for" attribute
    And screen readers should announce field purposes correctly

@critical @performance
Feature: Performance and Responsiveness
  Scenario: Calculator loads quickly
    Given I navigate to the calculator URL
    When I measure the page load time
    Then the page should load in under 3 seconds
    And all assets should be loaded
    And the interface should be interactive
    
  Scenario: Calculations execute instantly
    Given I have entered all required data
    When I click "Estimate Cost of Delay"
    Then results should appear in under 100 milliseconds
    And the UI should not freeze or lag
    
  Scenario: Large comparison sets perform well
    Given I add 50 projects to comparison
    When I view the comparison table
    Then the table should render in under 1 second
    And sorting should remain fast
    And the UI should remain responsive

@regression
Feature: Regression Prevention
  Scenario: Annual to hourly conversion is accurate
    Given I select "Annual Salary" input type
    And I enter "$120,000"
    When the system calculates the hourly rate
    Then the hourly rate should be "$57.69"
    And the calculation should use 2,080 work hours per year
    
  Scenario: FTE multiplier is applied correctly
    Given the annual salary is "$100,000"
    And the FTE fully loaded cost is "1.5"
    When employee costs are calculated
    Then the true annual cost should be "$150,000"
    And benefits, insurance, and overhead should be accounted for
