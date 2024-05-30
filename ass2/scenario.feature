Feature: Does the month have 30 days?

  Scenario: January does not have 30 days
    Given this month is January
    When I ask if this month has 30 days
    Then I should be told "No"

  
  Scenario: April has 30 days
    Given this month is April
    When I ask if this month has 30 days
    Then I should be told "Yes"