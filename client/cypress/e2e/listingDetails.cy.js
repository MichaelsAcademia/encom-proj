/// <reference types="cypress" />

describe("Listing Details Page", () => {
  const mockListing = {
    _id: "listing123",
    title: "Test Product",
    description: "This is a test product description",
    price: 99.99,
    category: "electronics",
    sellerId: "seller456",
    images: ["product-image.jpg"],
    status: "available",
    quantity: 5,
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-20T15:30:00Z"
  };

  const mockSeller = {
    username: "selleruser",
    picture: "",
    rating: 4.5
  };

  const mockSellerListings = {
    listings: [
      { _id: "other1", title: "Other Item 1", price: 29.99, images: [] },
      { _id: "other2", title: "Other Item 2", price: 39.99, images: [] }
    ]
  };

  const mockSimilarListings = {
    listings: [
      { _id: "similar1", title: "Similar Item 1", price: 89.99, images: [] },
      { _id: "similar2", title: "Similar Item 2", price: 109.99, images: [] }
    ]
  };

  beforeEach(() => {
    cy.intercept("GET", "/api/v1/listings/listing123", {
      statusCode: 200,
      body: mockListing
    }).as("getListing");

    cy.intercept("GET", "/api/v1/users/seller/*", {
      statusCode: 200,
      body: { seller: mockSeller }
    }).as("getSeller");

    cy.intercept("GET", "/api/v1/listings?seller=*", {
      statusCode: 200,
      body: mockSellerListings
    }).as("getSellerListings");

    cy.intercept("GET", "/api/v1/listings?category=*", {
      statusCode: 200,
      body: mockSimilarListings
    }).as("getSimilarListings");

    cy.intercept("GET", "/api/v1/listings/popular", {
      statusCode: 200,
      body: []
    }).as("getPopularItems");
  });

  describe("Listing Information", () => {
    it("displays listing title", () => {
      cy.visit("/listing/listing123");
      cy.wait("@getListing");

      cy.contains("Test Product").should("be.visible");
    });

    it("displays listing price", () => {
      cy.visit("/listing/listing123");
      cy.wait("@getListing");

      cy.contains("$ 99.99").should("be.visible");
    });

    it("displays listing description", () => {
      cy.visit("/listing/listing123");
      cy.wait("@getListing");

      cy.contains("This is a test product description").should("be.visible");
    });

    it("displays Details section", () => {
      cy.visit("/listing/listing123");
      cy.wait("@getListing");

      cy.contains("Details").should("be.visible");
    });

    it("displays availability status", () => {
      cy.visit("/listing/listing123");
      cy.wait("@getListing");

      cy.contains("Availability").should("be.visible");
      cy.contains("Available").should("be.visible");
    });

    it("displays category", () => {
      cy.visit("/listing/listing123");
      cy.wait("@getListing");

      cy.contains("Category").should("be.visible");
      cy.contains("Electronics").should("be.visible");
    });
  });

  describe("Seller Information", () => {
    it("displays seller username", () => {
      cy.visit("/listing/listing123");
      cy.wait("@getListing");
      cy.wait("@getSeller");

      cy.contains("Selleruser").should("be.visible");
    });
  });

  describe("Add to Cart", () => {
    it("displays Add to Cart button", () => {
      cy.visit("/listing/listing123");
      cy.wait("@getListing");

      cy.contains("Add to Cart").should("be.visible");
    });

    it("shows error when not logged in", () => {
      cy.visit("/listing/listing123");
      cy.window().then((win) => {
        win.localStorage.removeItem("encomToken");
      });
      cy.wait("@getListing");

      cy.contains("Add to Cart").click();
      cy.contains("Error, Please Login").should("be.visible");
    });
  });

  describe("Related Listings", () => {
    it("displays More From Seller section", () => {
      cy.visit("/listing/listing123");
      cy.wait("@getListing");
      cy.wait("@getSellerListings");

      cy.contains("More From Seller").should("be.visible");
    });

    it("displays Similar Listings section", () => {
      cy.visit("/listing/listing123");
      cy.wait("@getListing");
      cy.wait("@getSimilarListings");

      cy.contains("Similar Listings").should("be.visible");
    });
  });

  describe("Price Disclaimer", () => {
    it("displays shipping disclaimer", () => {
      cy.visit("/listing/listing123");
      cy.wait("@getListing");

      cy.contains("Listed price does not include shipping").should("be.visible");
    });
  });
});
