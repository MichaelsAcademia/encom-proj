/// <reference types="cypress" />

describe("Cart and Checkout Flow", () => {
  const testUser = {
    id: "12345",
    username: "testuser",
    email: "test@example.com",
  };

  const mockCart = {
    _id: "cart123",
    items: [
      {
        _id: "item1",
        quantity: 2,
        priceAtAdd: 10,
        listingId: { title: "Test Product", images: ["test.jpg"] },
      },
    ],
  };

  beforeEach(() => {
    cy.intercept("POST", "/api/v1/auth/login", {
      statusCode: 200,
      body: { user: testUser, token: "fake-jwt" },
    }).as("login");

    cy.window().then((win) => {
      win.localStorage.setItem("encomUser", JSON.stringify(testUser));
      win.localStorage.setItem("encomToken", "fake-jwt");
    });

    cy.intercept("GET", "/api/v1/carts/12345", {
      statusCode: 200,
      body: mockCart,
    }).as("getCart");

    cy.intercept("PUT", "/api/v1/carts/12345/items/item1", {
      statusCode: 200,
      body: mockCart,
    }).as("updateItem");

    cy.intercept("DELETE", "/api/v1/carts/12345/items/item1", {
      statusCode: 200,
    }).as("removeItem");
  });

  it("logs in, manages cart, and proceeds to checkout", () => {
    cy.visit(`http://localhost:5173/login?email=${testUser.email}`);

    cy.get('input[placeholder="Password"]')
      .should("be.visible")
      .type("Password123!");

    cy.contains("button", "Log In")
      .should("be.visible")
      .click();

    cy.wait("@login");
    cy.url({ timeout: 10000 }).should("eq", "http://localhost:5173/");

    cy.visit("http://localhost:5173/cart");
    cy.wait("@getCart");

    cy.contains("Your Cart").should("exist");

    cy.contains("Test Product").should("exist");
    cy.contains("$10.00").should("exist");
    cy.contains("$20.00").should("exist");

    cy.contains("+").click();
    cy.wait("@updateItem");

    cy.contains("Delete").click();
    cy.wait("@removeItem");

    cy.window().then((win) =>
      win.localStorage.setItem("lastCart", JSON.stringify(mockCart))
    );

    cy.contains("Proceed to Checkout").click();
    cy.url().should("include", "/checkout");

    cy.contains("Order Summary").should("exist");
    cy.contains("Test Product").should("exist");
    cy.contains("$20.00").should("exist");
  });
});