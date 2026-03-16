Feature: Login and Logout
  As a user of the Sauce Demo application
  I want to login and logout
  So that I can access and leave my account securely

  @smoke @regression
  Scenario: Successful login with standard user
    Given the user is on the login page
    When the user logs in as a standard user
    Then they should be redirected to the Products page

  @regression
  Scenario: Successful logout returns to login page
    Given the user is on the login page
    And the user logs in as a standard user
    When the user logs out
    Then the login form should be visible
    And the URL should contain "/"

  @regression
  Scenario: Locked out user sees an error message
    Given the user is on the login page
    When the user attempts to login as a locked out user
    Then an error message should be displayed
    And the error message should contain "locked out"
