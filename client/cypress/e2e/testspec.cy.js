/// <reference types="cypress" />

describe("Cart and Checkout Flow", () => {
  const testUser = {
    email: "test@example.com",
    password: "Password123!"
  };

  const mockCart = {
    _id: "cart123",
    items: [
      {
        _id: "item1",
        quantity: 2,
        priceAtAdd: 10,
        listingId: { title: "Test Product", images: ["test.jpg"] }
      }
    ]
  };

  beforeEach(() => {
    cy.intercept("POST", "/api/v1/auth/login", {
      statusCode: 200,
      body: { user: { username: "testuser" }, token: "fake-jwt" }
    }).as("login");

    cy.intercept("GET", `/api/v1/carts/*`, {
      statusCode: 200,
      body: mockCart
    }).as("getCart");

    cy.intercept("PUT", `/api/v1/carts/*/items/*`, {
      statusCode: 200
    }).as("updateItem");

    cy.intercept("DELETE", `/api/v1/carts/*/items/*`, {
      statusCode: 200
    }).as("removeItem");
  });

  it("logs in, manages cart, and proceeds to checkout", () => {
    cy.visit(`http://localhost:5173/login?email=${testUser.email}`);

    cy.get('input[placeholder="Password"]').should("be.visible").type(testUser.password);
    cy.get('button').contains("Log In").should("be.visible").click();

    cy.wait("@login");
    cy.url({ timeout: 10000 }).should("eq", "http://localhost:5173/");

    cy.visit("http://localhost:5173/cart");
    cy.wait("@getCart");

    cy.contains("Shopping Cart").should("exist");
    cy.contains("Test Product").should("exist");
    cy.contains("$10").should("exist");

    cy.contains("+").click();
    cy.wait("@updateItem");

    cy.contains("Remove").click();
    cy.wait("@removeItem");

    cy.window().then(win => win.localStorage.setItem("lastCart", JSON.stringify(mockCart)));

    cy.contains("Proceed to Checkout").click();
    cy.url().should("include", "/checkout");

    cy.contains("Order Summary").should("exist");
    cy.contains("Test Product").should("exist");
    cy.contains("$20.00").should("exist"); // 2 × 10
  });
});
