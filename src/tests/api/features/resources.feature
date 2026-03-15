Feature: Resources API
  As an API consumer
  I want to retrieve resources from the API
  So that I can access colour data in the system

  @smoke @regression
  Scenario: Retrieve a paginated list of resources
    Given the API client is initialised
    When I send a GET request to the resources endpoint
    Then the response status should be 200
    And the response should be a valid paginated list of resources

  @regression
  Scenario: Resources response contains expected fields
    Given the API client is initialised
    When I send a GET request to the resources endpoint
    Then each resource should have id, name, year, color, and pantone_value fields

  @regression
  Scenario: Resources response includes support information
    Given the API client is initialised
    When I send a GET request to the resources endpoint
    Then the response should contain support url and text

  @regression
  Scenario: Retrieve a single resource by ID
    Given the API client is initialised
    When I send a GET request for resource with ID 2
    Then the response status should be 200
    And the resource ID should be 2
    And the resource should have name, year, color, and pantone_value fields

  @regression
  Scenario: Return 404 for a non-existent resource
    Given the API client is initialised
    When I send a GET request for resource with ID 9999
    Then the response status should be 404
