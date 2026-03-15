Feature: Authentication API
  As an API consumer
  I want to register and login via the API
  So that I can authenticate users in the system

  @smoke @regression
  Scenario: Register a user with valid credentials
    Given the API client is initialised
    When I send a POST request to register with email "eve.holt@reqres.in" and password "pistol"
    Then the response status should be 200
    And the response should contain a numeric id and a token string

  @regression
  Scenario: Registration fails when password is missing
    Given the API client is initialised
    When I send a POST request to register with email "eve.holt@reqres.in" and no password
    Then the response status should be 400
    And the response should contain an error message

  @regression
  Scenario: Registration fails for an unsupported user
    Given the API client is initialised
    When I send a POST request to register with a random email and password
    Then the response status should be 400
    And the response should contain an error message

  @smoke @regression
  Scenario: Login with valid credentials
    Given the API client is initialised
    When I send a POST request to login with email "eve.holt@reqres.in" and password "cityslicka"
    Then the response status should be 200
    And the response should contain a token string

  @regression
  Scenario: Login fails when password is missing
    Given the API client is initialised
    When I send a POST request to login with email "eve.holt@reqres.in" and no password
    Then the response status should be 400
    And the response should contain an error message
