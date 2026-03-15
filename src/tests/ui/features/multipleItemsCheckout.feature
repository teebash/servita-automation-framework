Feature: Multiple Items Checkout
  As a customer of the Sauce Demo store
  I want to purchase multiple items at once
  So that I can complete a bulk checkout

  @regression
  Scenario: Complete checkout with multiple items
    Given the user is logged in as a standard user
    When the user adds the following items to the cart:
      | item name               |
      | Sauce Labs Backpack     |
      | Sauce Labs Bike Light   |
      | Sauce Labs Bolt T-Shirt |
    And the cart badge shows 3 items
    And the user navigates to the cart
    Then the cart should contain 3 items
    And the cart should contain all selected items
    When the user proceeds to checkout
    And the user enters their shipping information
    And the user continues to the overview
    Then the overview should display all selected items
    When the user finishes the order
    Then the order should be confirmed as complete
