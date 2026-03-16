Feature: Users API
  As an API consumer
  I want to manage users via the RESTful API
  So that I can create, read, and update user records

  @smoke @regression
  Scenario: Retrieve a paginated list of users
    Given the API client is initialised
    When I send a GET request to the users endpoint
    Then the response status should be 200
    And the response should be a valid paginated list
    And the list should contain users with 6 per page

  @regression
  Scenario: Users response contains expected fields
    Given the API client is initialised
    When I send a GET request to the users endpoint
    Then each user should have id, email, first_name, last_name, and avatar fields

  @regression
  Scenario: Paginate through users
    Given the API client is initialised
    When I send a GET request to users page 1
    And I send a GET request to users page 2
    Then the pages should return different users

  @smoke @regression
  Scenario: Retrieve a single user by ID
    Given the API client is initialised
    When I send a GET request for user with ID 2
    Then the response status should be 200
    And the user ID should be 2
    And the user should have email, first_name, last_name, and avatar fields

  @regression
  Scenario: Return 404 for a non-existent user
    Given the API client is initialised
    When I send a GET request for user with ID 9999
    Then the response status should be 404

  @smoke @regression
  Scenario: Create a new user with generated data
    Given the API client is initialised
    And a user payload is built with generated data
    When I send a POST request to create the user
    Then the response status should be 201
    And the response should contain the submitted name and job
    And the response should include an id and createdAt timestamp

  @regression
  Scenario: Create a user with custom values
    Given the API client is initialised
    And a user payload is built with custom name and job
    When I send a POST request to create the user
    Then the response status should be 201
    And the response should contain the submitted name and job

  @regression
  Scenario: Update an existing user
    Given the API client is initialised
    And an update payload is built with a new name and job
    When I send a PUT request to update user with ID 2
    Then the response status should be 200
    And the response should contain the updated name and job
    And the response should include an updatedAt timestamp
