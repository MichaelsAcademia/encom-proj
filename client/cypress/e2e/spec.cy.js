// Common fixtures and helpers
const mockToken = "mockToken";
const mockListing = {
  _id: "listing123",
  title: "Example Product",
  price: 50,
  images: ["img1.jpg"],
  sellerId: "seller123"
};
const mockOrder = {
  _id: "order123",
  items: [{ listingId: mockListing._id, quantity: 2, priceAtCheckout: mockListing.price }],
  total: 100,
  status: "ordered",
  createdAt: "2025-01-01T12:00:00.000Z",
  updatedAt: "2025-01-01T12:00:00.000Z"
};

const interceptListing = (id, body, alias = "getListing") =>
  cy.intercept("GET", `/api/v1/listings/${id}`, { statusCode: 200, body }).as(alias);

const interceptOrders = () => {
  cy.intercept("GET", "/api/v1/orders/user/*", {
    statusCode: 200,
    body: [mockOrder]
  }).as("getOrders");

  cy.intercept("GET", "/api/v1/orders/*", {
    statusCode: 200,
    body: mockOrder
  }).as("getOrder");
};

beforeEach(() => {
  window.localStorage.setItem("encomToken", mockToken);
  window.localStorage.setItem("encomUser", JSON.stringify({ id: "user123", username: "test", email: "test@test.com" }));
  interceptOrders();
  interceptListing(mockListing._id, mockListing, "getListing");
  cy.intercept("POST", "/api/v1/reviews", { statusCode: 200, body: { ok: true } }).as("postReview");
});

describe("Orders Page", () => {
  it("loads orders page", () => {
    cy.visit("/orders");

    cy.wait("@getOrders");
    cy.contains(/Orders|Your Orders|No Orders/i).should("exist");
  });
});

describe("Order Details Page", () => {
  it("shows order summary and items", () => {
    cy.visit("/orders/order123", { failOnStatusCode: false });

    cy.wait("@getOrder");
    cy.wait("@getListing");

    cy.contains("Order Details").should("exist");
    cy.contains("Order #order123").should("exist");
    cy.contains("Example Product").should("exist");
    cy.contains("$100.00").should("exist");
  });
});

describe("Reviews Page", () => {
  it("allows rating, comment, and submitting review", () => {
    interceptListing(
      "lid1",
      {
        _id: "lid1",
        title: "Test Product",
        price: 50,
        images: ["img1.jpg"],
        sellerId: "seller123"
      },
      "getListingReview"
    );

    cy.visit("/review?order=ord1&listing=lid1&product=Test%20Product", { failOnStatusCode: false });

    cy.wait("@getListingReview");

    cy.contains("Test Product").should("exist");
    cy.get("button.star").eq(3).click();
    cy.get("textarea").type("Great product!");
    cy.get("button[type='submit']").click();

    cy.wait("@postReview");
    cy.url().should("include", "/orders/ord1");
  });
});
