Feature: Single Item Checkout
  As a customer of the Sauce Demo store
  I want to purchase a single item
  So that I can complete a checkout with one product

  @smoke @regression
  Scenario: Complete checkout with a single item
    Given the user is logged in as a standard user
    When the user adds "Sauce Labs Backpack" to the cart
    And the cart badge shows 1 item
    And the user navigates to the cart
    Then the cart should contain 1 item
    And the cart should contain "Sauce Labs Backpack"
    When the user proceeds to checkout
    And the user enters their shipping information
    And the user continues to the overview
    Then the overview should display "Sauce Labs Backpack"
    When the user finishes the order
    Then the order should be confirmed as complete
