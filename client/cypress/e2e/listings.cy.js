/// <reference types="cypress" />

describe("Listings Page", () => {
  const mockListings = [
    { _id: "listing1", title: "Test Product 1", price: 29.99, images: ["img1.jpg"] },
    { _id: "listing2", title: "Test Product 2", price: 49.99, images: ["img2.jpg"] },
    { _id: "listing3", title: "Test Product 3", price: 99.99, images: [] }
  ];

  const mockApiResponse = {
    listings: mockListings,
    total: 50
  };

  beforeEach(() => {
    cy.intercept("GET", "/api/v1/listings?*", {
      statusCode: 200,
      body: mockApiResponse
    }).as("getListings");

    cy.intercept("GET", "/api/v1/listings/popular", {
      statusCode: 200,
      body: mockListings
    }).as("getPopularItems");
  });

  describe("Page Content", () => {
    it("displays listings header", () => {
      cy.visit("/listings");
      cy.wait("@getListings");

      cy.contains("Listings").should("be.visible");
    });

    it("displays listings from API", () => {
      cy.visit("/listings");
      cy.wait("@getListings");

      cy.contains("Test Product 1").should("be.visible");
      cy.contains("Test Product 2").should("be.visible");
      cy.contains("Test Product 3").should("be.visible");
    });

    it("displays listing prices", () => {
      cy.visit("/listings");
      cy.wait("@getListings");

      cy.contains("$29.99").should("be.visible");
      cy.contains("$49.99").should("be.visible");
      cy.contains("$99.99").should("be.visible");
    });

    it("displays results count", () => {
      cy.visit("/listings");
      cy.wait("@getListings");

      cy.contains("Results").should("be.visible");
      cy.contains("of 50").should("be.visible");
    });
  });

  describe("Pagination", () => {
    it("displays pagination controls", () => {
      cy.visit("/listings");
      cy.wait("@getListings");

      cy.contains("<").should("be.visible");
      cy.contains(">").should("be.visible");
      cy.contains("Page 1").should("be.visible");
    });

    it("previous button is disabled on first page", () => {
      cy.visit("/listings?page=1");
      cy.wait("@getListings");

      cy.contains("<").should("have.attr", "data-disabled", "true");
    });

    it("can navigate to next page", () => {
      cy.visit("/listings?page=1");
      cy.wait("@getListings");

      cy.contains(">").click();
      cy.url().should("include", "page=2");
    });
  });

  describe("Listing Navigation", () => {
    it("clicking a listing navigates to details page", () => {
      cy.visit("/listings");
      cy.wait("@getListings");

      cy.contains("Test Product 1").click();
      cy.url().should("include", "/listing/listing1");
    });
  });

  describe("Loading State", () => {
    it("shows loading indicator while fetching", () => {
      cy.intercept("GET", "/api/v1/listings?*", {
        statusCode: 200,
        body: mockApiResponse,
        delay: 500
      }).as("getListingsDelayed");

      cy.visit("/listings");
      cy.contains("Loading").should("be.visible");
      cy.wait("@getListingsDelayed");
    });
  });
});
