/// <reference types="cypress" />

describe("Home Page", () => {
  const mockPopularItems = [
    {
      _id: "item1",
      title: "Popular Item 1",
      price: 29.99,
      images: ["https://placehold.co/400"]
    },
    {
      _id: "item2",
      title: "Popular Item 2",
      price: 49.99,
      images: ["https://placehold.co/400"]
    },
    {
      _id: "item3",
      title: "Popular Item 3",
      price: 99.99,
      images: []
    }
  ];

  beforeEach(() => {
    // Intercept the popular items API call
    cy.intercept("GET", "/api/v1/listings/popular", {
      statusCode: 200,
      body: mockPopularItems
    }).as("getPopularItems");
  });

  describe("Hero Section", () => {
    it("displays the hero title and subtitle", () => {
      cy.visit("/");
      
      cy.contains("Buy. Sell. Discover.").should("be.visible");
      cy.contains("Directly From People Like You.").should("be.visible");
    });
  });

  describe("Popular Items Section", () => {
    it("displays the popular items section title", () => {
      cy.visit("/");
      
      cy.contains("Popular Items").should("be.visible");
    });

    it("fetches and displays popular items", () => {
      cy.visit("/");
      cy.wait("@getPopularItems");

      cy.contains("Popular Item 1").should("be.visible");
      cy.contains("Popular Item 2").should("be.visible");
      cy.contains("Popular Item 3").should("be.visible");
    });

    it("displays popular item prices", () => {
      cy.visit("/");
      cy.wait("@getPopularItems");

      cy.contains("$29.99").should("be.visible");
      cy.contains("$49.99").should("be.visible");
      cy.contains("$99.99").should("be.visible");
    });

    it("popular items link to their detail pages", () => {
      cy.visit("/");
      cy.wait("@getPopularItems");

      cy.contains("Popular Item 1").click();
      cy.url().should("include", "/listing/item1");
    });
  });

  describe("Shop and Sell Section", () => {
    it("displays shop and sell section content", () => {
      cy.visit("/");

      cy.contains("Find it. Love it. Own it.").should("be.visible");
      cy.contains("List it. Ship it. Profit.").should("be.visible");
      cy.contains("Shop Now").should("be.visible");
      cy.contains("Sell Now").should("be.visible");
    });

    it("Shop Now link navigates to listings page", () => {
      cy.visit("/");

      cy.contains("Shop Now").click();
      cy.url().should("include", "/listings");
    });

    it("Sell Now button redirects to login when not authenticated", () => {
      cy.visit("/");
      
      // Ensure no token exists
      cy.window().then((win) => {
        win.localStorage.removeItem("encomToken");
      });

      cy.contains("Sell Now").click();
      cy.url().should("include", "/login");
    });

    it("Sell Now button redirects to new listing when authenticated", () => {
      cy.visit("/");

      // Set a fake token
      cy.window().then((win) => {
        win.localStorage.setItem("encomToken", "fake-jwt-token");
      });

      cy.contains("Sell Now").click();
      cy.url().should("include", "/listings/new");
    });
  });

  describe("Stats Section", () => {
    it("displays all statistics", () => {
      cy.visit("/");

      // Scroll to stats section to trigger the visibility animation
      cy.contains("99.5%").scrollIntoView();
      
      // Wait for animation to complete
      cy.wait(500);

      cy.contains("99.5%").should("be.visible");
      cy.contains("Satisfaction Rate").should("be.visible");
      cy.contains("1000+").should("be.visible");
      cy.contains("Orders Fulfilled").should("be.visible");
      cy.contains("500+").should("be.visible");
      cy.contains("Verified Sellers").should("be.visible");
    });
  });

  describe("Navigation from Home", () => {
    it("can navigate to listings from navbar", () => {
      cy.visit("/");

      cy.contains("button", "Listings").click();
      cy.url().should("include", "/listings");
    });

    it("logo links back to home", () => {
      cy.visit("/");

      // Navigate away first
      cy.contains("Shop Now").click();
      cy.url().should("include", "/listings");

      // Click logo to go back home
      cy.contains("ENCOM").click();
      cy.url().should("eq", Cypress.config().baseUrl + "/");
    });
  });

  describe("Responsive Behavior", () => {
    it("displays correctly on mobile viewport", () => {
      cy.viewport("iphone-x");
      cy.visit("/");

      cy.contains("Buy. Sell. Discover.").should("be.visible");
      cy.contains("Popular Items").should("be.visible");
      cy.contains("Shop Now").should("be.visible");
    });

    it("displays correctly on tablet viewport", () => {
      cy.viewport("ipad-2");
      cy.visit("/");

      cy.contains("Buy. Sell. Discover.").should("be.visible");
      cy.contains("Popular Items").should("be.visible");
      cy.contains("Shop Now").should("be.visible");
    });

    it("displays correctly on desktop viewport", () => {
      cy.viewport(1920, 1080);
      cy.visit("/");

      cy.contains("Buy. Sell. Discover.").should("be.visible");
      cy.contains("Popular Items").should("be.visible");
      cy.contains("Shop Now").should("be.visible");
    });
  });

  describe("Error Handling", () => {
    it("handles API error gracefully", () => {
      cy.intercept("GET", "/api/v1/listings/popular", {
        statusCode: 500,
        body: { error: "Server error" }
      }).as("getPopularItemsError");

      cy.visit("/");
      cy.wait("@getPopularItemsError");

      // Page should still load without crashing
      cy.contains("Buy. Sell. Discover.").should("be.visible");
      cy.contains("Popular Items").should("be.visible");
    });
  });
});
