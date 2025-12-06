import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import ListingDetails from "../pages/listings/listing-details";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

const mockUser = {
  id: "user123",
  username: "testuser",
  email: "test@example.com"
};

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
  picture: "seller-pic.jpg",
  rating: 4.5
};

const mockSellerListings = {
  listings: [
    { _id: "other1", title: "Other Item 1", price: 29.99, images: ["img1.jpg"] },
    { _id: "other2", title: "Other Item 2", price: 39.99, images: ["img2.jpg"] }
  ]
};

const mockSimilarListings = {
  listings: [
    { _id: "similar1", title: "Similar Item 1", price: 89.99, images: ["sim1.jpg"] },
    { _id: "similar2", title: "Similar Item 2", price: 109.99, images: ["sim2.jpg"] }
  ]
};

function renderWithRouter(component, listingId = "listing123") {
  return render(
    <MemoryRouter initialEntries={[`/listing/${listingId}`]}>
      <Routes>
        <Route path="/listing/:listingId" element={component} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Listing Details Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    // Setup default axios mocks
    axios.get.mockImplementation((url) => {
      if (url.includes("/api/v1/listings/listing123")) {
        return Promise.resolve({ data: mockListing });
      }
      if (url.includes("/api/v1/users/seller/")) {
        return Promise.resolve({ data: { seller: mockSeller } });
      }
      if (url.includes("seller=")) {
        return Promise.resolve({ data: mockSellerListings });
      }
      if (url.includes("category=")) {
        return Promise.resolve({ data: mockSimilarListings });
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });
  });

  test("fetches listing details on mount", async () => {
    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/api/v1/listings/listing123");
    });
  });

  test("displays listing title", async () => {
    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });
  });

  test("displays listing price", async () => {
    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(screen.getByText("$ 99.99")).toBeInTheDocument();
    });
  });

  test("displays Add to Cart button", async () => {
    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Add to Cart")).toBeInTheDocument();
    });
  });

  test("displays Details section", async () => {
    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Details")).toBeInTheDocument();
    });
  });

  test("displays listing description", async () => {
    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(screen.getByText("This is a test product description")).toBeInTheDocument();
    });
  });

  test("displays price in additional info", async () => {
    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Price")).toBeInTheDocument();
    });
  });

  test("displays availability status", async () => {
    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Availability")).toBeInTheDocument();
      expect(screen.getByText("Available")).toBeInTheDocument();
    });
  });

  test("displays category", async () => {
    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Category")).toBeInTheDocument();
      expect(screen.getByText("Electronics")).toBeInTheDocument();
    });
  });

  test("displays date added and last updated", async () => {
    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Date Added")).toBeInTheDocument();
      expect(screen.getByText("Last Updated")).toBeInTheDocument();
    });
  });

  test("displays shipping disclaimer", async () => {
    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(screen.getByText("* Listed price does not include shipping")).toBeInTheDocument();
    });
  });

  test("shows error when adding to cart without login", async () => {
    const userWithoutAuth = { id: null, username: null, email: null };

    await act(async () => {
      renderWithRouter(<ListingDetails user={userWithoutAuth} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Add to Cart")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Add to Cart"));
    });

    await waitFor(() => {
      expect(screen.getByText("Error, Please Login")).toBeInTheDocument();
    });
  });

  test("handles successful cart add", async () => {
    localStorage.setItem("encomToken", "fake-token");
    axios.put.mockResolvedValueOnce({ data: { success: true } });

    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Add to Cart")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Add to Cart"));
    });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        `/api/v1/carts/?userId=${mockUser.id}`,
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
              listingId: "listing123",
              quantity: 1
            })
          ])
        }),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer fake-token"
          })
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Added!")).toBeInTheDocument();
    });
  });

  test("fetches seller details when sellerId is available", async () => {
    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/users/seller/")
      );
    });
  });

  test("displays seller username", async () => {
    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Selleruser")).toBeInTheDocument();
    });
  });

  test("displays More From Seller section when seller has other listings", async () => {
    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(screen.getByText("More From Seller")).toBeInTheDocument();
    });
  });

  test("displays Similar Listings section", async () => {
    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Similar Listings")).toBeInTheDocument();
    });
  });

  test("handles cart add error", async () => {
    localStorage.setItem("encomToken", "fake-token");
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    axios.put.mockRejectedValueOnce(new Error("Network error"));

    await act(async () => {
      renderWithRouter(<ListingDetails user={mockUser} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Add to Cart")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Add to Cart"));
    });

    await waitFor(() => {
      expect(screen.getByText("Error Adding to Cart")).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});
