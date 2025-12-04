/// <reference types="cypress" />

describe("Cart and Checkout Flow", () => {
  const testUser = {
    email: "test@example.com",
    username: "testuser",
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

  it("should sign up or log in, display cart items, update quantity, remove item, and proceed to checkout", () => {
    cy.visit("http://localhost:5173/login");
    cy.get('input[type="email"]').type(testUser.email);
    cy.contains("Continue").click();

    cy.url().then(url => {
      if (url.includes("/signup")) {
        cy.get('input[name="username"]').should("be.visible").type(testUser.username);
        cy.get('input[placeholder="Password"]').should("be.visible").type(testUser.password);
        cy.get('input[placeholder="Confirm Password"]').should("be.visible").type(testUser.password);
        cy.get('button').contains("Sign Up").should("be.visible").click();
      } else if (url.includes("/login")) {
        cy.get('input[placeholder="Password"]').should("be.visible").type(testUser.password);
        cy.get('button').contains("Log In").should("be.visible").click();
      }
    });

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
