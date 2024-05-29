Feature: A feature to check if a number is even
  Description

  Scenario: Testing an even number
    Given The number is 4
    When asking if the number is even
    Then I should see the output "Yes"

  Scenario: Testing an odd number
    Given The number is 5
    When asking if the number is even
    Then I should see the output "No"
