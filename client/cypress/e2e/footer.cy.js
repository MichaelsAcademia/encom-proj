/// <reference types="cypress" />

describe("Footer", () => {
  const mockPopularItems = [
    { _id: "item1", title: "Item 1", price: 29.99, images: [] }
  ];

  beforeEach(() => {
    cy.intercept("GET", "/api/v1/listings/popular", {
      statusCode: 200,
      body: mockPopularItems
    }).as("getPopularItems");

    cy.intercept("GET", "/api/v1/listings*", {
      statusCode: 200,
      body: { listings: [], total: 0 }
    }).as("getListings");
  });

  describe("Footer Content", () => {
    it("displays all section headings", () => {
      cy.visit("/");

      cy.get(".footer").scrollIntoView();

      cy.contains("Shop").should("be.visible");
      cy.contains("Sell").should("be.visible");
      cy.contains("Account").should("be.visible");
      cy.contains("Contact Us").should("be.visible");
    });

    it("displays copyright text", () => {
      cy.visit("/");

      cy.get(".footer").scrollIntoView();
      cy.contains("© Encom 2025").should("be.visible");
    });
  });

  describe("Footer Links", () => {
    it("Shop links navigate correctly", () => {
      cy.visit("/");
      cy.get(".footer").scrollIntoView();

      cy.contains("All Products").should("have.attr", "href", "/listings");
      cy.contains("New Arrivals").should("have.attr", "href", "/listings?page=1&sort=new");
    });

    it("Account links navigate correctly", () => {
      cy.visit("/");
      cy.get(".footer").scrollIntoView();

      cy.contains("Cart").should("have.attr", "href", "/cart");
      cy.contains("Order History").should("have.attr", "href", "/orders");
    });

    it("Contact links are present", () => {
      cy.visit("/");
      cy.get(".footer").scrollIntoView();

      cy.contains("Email Support").should("have.attr", "href").and("include", "mailto:");
      cy.contains("Frequently Asked Questions").should("have.attr", "href", "/faq");
    });
  });

  describe("Footer Persistence", () => {
    it("footer is visible on home page", () => {
      cy.visit("/");
      cy.get(".footer").scrollIntoView().should("exist");
    });
  });
});
