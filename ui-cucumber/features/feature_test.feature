Feature: A feature to check Login on Codio website

  Scenario: Trying to log in without a password
    Given A user opens Codio login page
    When The username field filled up with "Username"
    Then The "Sign In" button should be disabled

  Scenario: Trying to log in without a username
    Given A user opens Codio login page
    When The password field filled up with "Password"
    Then The "Sign In" button should be disabled

  Scenario: Trying to log in with a username and a password
    Given A user opens Codio login page
    When The username field filled up with "Username"
    And The password field filled up with "Password"
    Then The "Sign In" button should be enabled
