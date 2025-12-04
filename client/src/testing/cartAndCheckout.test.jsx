import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import CartPage from "../pages/cart/CartPage";
import Checkout from "../pages/checkout/Checkout";
import { AuthContext } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

global.fetch = jest.fn();

const mockUser = {
  id: "12345",
  username: "testuser",
  email: "test@example.com"
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
        images: ["test.jpg"]
      }
    }
  ]
};

function renderWithProviders(component) {
  return render(
    <AuthContext.Provider value={{ user: mockUser }}>
      <BrowserRouter>{component}</BrowserRouter>
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
      json: async () => mockCart
    });

    renderWithProviders(<CartPage />);

    expect(screen.getByText(/Loading cart/i)).toBeInTheDocument();

    expect(await screen.findByText("Shopping Cart")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
  });

  test("updates item quantity", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockCart });
    fetch.mockResolvedValueOnce({ ok: true }); // PUT
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockCart });

    renderWithProviders(<CartPage />);

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
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockCart });
    fetch.mockResolvedValueOnce({ ok: true }); // DELETE
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ...mockCart, items: [] }) });

    renderWithProviders(<CartPage />);

    const removeBtn = await screen.findByText("Remove");
    await act(async () => {
      fireEvent.click(removeBtn);
    });

    expect(fetch).toHaveBeenCalledWith(
      `/api/v1/carts/${mockUser.id}/items/item1`,
      expect.objectContaining({ method: "DELETE" })
    );
  });

  test("navigates to checkout and stores lastCart", async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockCart });

    renderWithProviders(<CartPage />);

    const btn = await screen.findByText("Proceed to Checkout");
    await act(async () => {
      fireEvent.click(btn);
    });

    expect(localStorage.getItem("lastCart")).toBe(JSON.stringify(mockCart));
    expect(mockNavigate).toHaveBeenCalledWith("/checkout");
  });

  test("Checkout page loads cart from localStorage", () => {
    localStorage.setItem("lastCart", JSON.stringify(mockCart));

    renderWithProviders(<Checkout />);

    expect(screen.getByText("Order Summary")).toBeInTheDocument();
    expect(screen.getByText("Test Product")).toBeInTheDocument();

    const prices = screen.getAllByText("$20.00");
    const total = prices.find(el => el.tagName.toLowerCase() === "h1");
    expect(total).toBeInTheDocument();
  });
});
