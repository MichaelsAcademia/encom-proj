import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CartPage from "../pages/cart/CartPage";
import Checkout from "../pages/checkout/Checkout";
import { AuthContext } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

global.fetch = jest.fn();

const mockUser = {
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
      listingId: {
        title: "Test Product",
        images: ["test.jpg"],
      },
    },
  ],
};

function renderWithProviders(ui) {
  return render(
    <AuthContext.Provider value={{ user: mockUser }}>
    <BrowserRouter>{ui}</BrowserRouter>
    </AuthContext.Provider>
  );
}

describe("CartPage & Checkout Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("loads cart and displays cart items", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCart,
    });

    renderWithProviders(<CartPage user={mockUser} />);

    // ✅ Wait for fetch-driven state update
    const product = await screen.findByText((txt) =>
      txt.includes("Test Product")
    );

    expect(product).toBeInTheDocument();
    expect(screen.getByText("$10.00")).toBeInTheDocument();
    expect(screen.getByText("$20.00")).toBeInTheDocument();
  });

  test("updates item quantity", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockCart })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCart })
      .mockResolvedValueOnce({ ok: true, json: async () => mockCart });

    renderWithProviders(<CartPage user={mockUser} />);

    // Wait for UI to stabilize
    await screen.findByText("Test Product");

    const plusButton = await screen.findByText("+");

    await act(async () => {
      fireEvent.click(plusButton);
    });

    expect(fetch).toHaveBeenCalledWith(
      `/api/v1/carts/${mockUser.id}/items/item1`,
      expect.objectContaining({ method: "PUT" })
    );
  });

  test("removes an item", async () => {
    fetch
      .mockResolvedValueOnce({ ok: true, json: async () => mockCart })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: "cart123", items: [] }),
      });

    renderWithProviders(<CartPage user={mockUser} />);

    await screen.findByText("Test Product");

    const removeBtn = await screen.findByText("Delete");

    await act(async () => {
      fireEvent.click(removeBtn);
    });

    expect(fetch).toHaveBeenCalledWith(
      `/api/v1/carts/${mockUser.id}/items/item1`,
      expect.objectContaining({ method: "DELETE" })
    );
  });

  test("navigates to checkout and stores lastCart", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockCart,
    });

    renderWithProviders(<CartPage user={mockUser} />);

    // ✅ CRITICAL: wait until CartPage overwrites lastCart with REAL cart
    await waitFor(() => {
      const stored = localStorage.getItem("lastCart");
      return stored && stored.includes("Test Product");
    });

    const btn = screen.getByText("Proceed to Checkout");

    await act(async () => {
      fireEvent.click(btn);
    });

    await waitFor(() => {
      expect(localStorage.getItem("lastCart")).toBe(JSON.stringify(mockCart));
    });

    expect(mockNavigate).toHaveBeenCalledWith("/checkout");
  });

  test("Checkout page loads cart from localStorage", () => {
    localStorage.setItem("lastCart", JSON.stringify(mockCart));

    renderWithProviders(<Checkout user={mockUser} />);

    expect(screen.getByText("Order Summary")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$20.00")).toBeInTheDocument();
  });
});