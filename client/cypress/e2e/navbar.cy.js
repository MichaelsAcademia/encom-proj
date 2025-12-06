/// <reference types="cypress" />

describe("Navbar", () => {
  const mockUser = {
    id: "user123",
    username: "testuser",
    email: "test@example.com"
  };

  const mockPopularItems = [
    { _id: "item1", title: "Item 1", price: 29.99, images: [] }
  ];

  beforeEach(() => {
    // Intercept common API calls
    cy.intercept("GET", "/api/v1/listings/popular", {
      statusCode: 200,
      body: mockPopularItems
    }).as("getPopularItems");

    cy.intercept("GET", "/api/v1/listings*", {
      statusCode: 200,
      body: { listings: [], total: 0 }
    }).as("getListings");
  });

  describe("Logo and Branding", () => {
    it("displays the ENCOM logo", () => {
      cy.visit("/");

      cy.contains("ENCOM").should("be.visible");
    });

    it("logo links to home page", () => {
      cy.visit("/listings");
      cy.wait("@getListings");

      cy.contains("ENCOM").click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });

  describe("Search", () => {
    it("displays the search input", () => {
      cy.visit("/");

      cy.get('input[placeholder="Search"]').should("be.visible");
    });

    it("search input is focusable", () => {
      cy.visit("/");

      cy.get('input[placeholder="Search"]').click().should("be.focused");
    });

    it("can type in search input", () => {
      cy.visit("/");

      cy.get('input[placeholder="Search"]')
        .type("test search")
        .should("have.value", "test search");
    });
  });

  describe("Navigation", () => {
    beforeEach(() => {
      // Ensure no token exists
      cy.window().then((win) => {
        win.localStorage.removeItem("encomToken");
      });
    });

    it("displays Listings button", () => {
      cy.visit("/");

      cy.contains("button", "Listings").should("be.visible");
    });

    it("Listings button navigates to listings page", () => {
      cy.visit("/");

      cy.contains("button", "Listings").click();
      cy.url().should("include", "/listings");
    });

    it("displays sign in button when not logged in", () => {
      cy.visit("/");

      // Should not show username
      cy.contains("Testuser").should("not.exist");
    });

    it("sign in button navigates to login page", () => {
      cy.visit("/");

      // Click the last nav button (sign in when not authenticated)
      cy.get(".nav-link-bttn").last().click();
      cy.url().should("include", "/login");
    });
  });

  describe("Navbar Persistence", () => {
    it("navbar is visible on home page", () => {
      cy.visit("/");

      cy.get(".nav").should("be.visible");
      cy.contains("ENCOM").should("be.visible");
    });

    it("navbar is visible on listings page", () => {
      cy.visit("/listings");
      cy.wait("@getListings");

      cy.get(".nav").should("be.visible");
      cy.contains("ENCOM").should("be.visible");
    });

    it("navbar is visible on cart page", () => {
      cy.intercept("GET", "/api/v1/carts/*", {
        statusCode: 200,
        body: { items: [] }
      }).as("getCart");

      cy.visit("/cart");

      cy.get(".nav").should("be.visible");
      cy.contains("ENCOM").should("be.visible");
    });
  });

  describe("Responsive Navbar", () => {
    it("navbar displays on mobile", () => {
      cy.viewport("iphone-x");
      cy.visit("/");

      cy.get(".nav").should("be.visible");
      cy.contains("ENCOM").should("be.visible");
    });

    it("navbar displays on tablet", () => {
      cy.viewport("ipad-2");
      cy.visit("/");

      cy.get(".nav").should("be.visible");
      cy.contains("ENCOM").should("be.visible");
    });

    it("navbar displays on desktop", () => {
      cy.viewport(1920, 1080);
      cy.visit("/");

      cy.get(".nav").should("be.visible");
      cy.contains("ENCOM").should("be.visible");
      cy.contains("button", "Listings").should("be.visible");
    });
  });

  describe("Navigation Flow", () => {
    it("can navigate from home to listings and back", () => {
      cy.visit("/");

      // Go to listings
      cy.contains("button", "Listings").click();
      cy.url().should("include", "/listings");
      cy.wait("@getListings");

      // Go back home via logo
      cy.contains("ENCOM").click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });
});
