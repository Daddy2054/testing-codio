Feature: Search for second country's capital

  Scenario: Searching for second capital city
    Given I open the capitals.html file
    When I select the second capital city
    Then I expect to see "Tirana"