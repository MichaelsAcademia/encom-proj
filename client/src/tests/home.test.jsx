import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Home } from "../pages/home/Home";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

jest.mock("axios");

const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
});
window.IntersectionObserver = mockIntersectionObserver;

const mockPopularItems = [
  {
    _id: "item1",
    title: "Popular Item 1",
    price: 29.99,
    images: ["image1.jpg"]
  },
  {
    _id: "item2",
    title: "Popular Item 2",
    price: 49.99,
    images: ["image2.jpg"]
  }
];

async function renderWithRouter(component) {
  let result;
  await act(async () => {
    result = render(<BrowserRouter>{component}</BrowserRouter>);
  });
  return result;
}

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    axios.get.mockResolvedValue({ data: mockPopularItems });
  });

  test("renders hero section with title and subtitle", async () => {
    await renderWithRouter(<Home />);

    expect(screen.getByText("Buy. Sell. Discover.")).toBeInTheDocument();
    expect(screen.getByText("Directly From People Like You.")).toBeInTheDocument();
  });

  test("renders popular items section title", async () => {
    await renderWithRouter(<Home />);

    expect(screen.getByText("Popular Items")).toBeInTheDocument();
  });

  test("fetches and displays popular items", async () => {
    await renderWithRouter(<Home />);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/api/v1/listings/popular");
    });

    await waitFor(() => {
      expect(screen.getByText("Popular Item 1")).toBeInTheDocument();
      expect(screen.getByText("Popular Item 2")).toBeInTheDocument();
    });
  });

  test("renders shop and sell sections", async () => {
    await renderWithRouter(<Home />);

    expect(screen.getByText("Find it. Love it. Own it.")).toBeInTheDocument();
    expect(screen.getByText("List it. Ship it. Profit.")).toBeInTheDocument();
    expect(screen.getByText("Shop Now")).toBeInTheDocument();
    expect(screen.getByText("Sell Now")).toBeInTheDocument();
  });

  test("Shop Now link navigates to listings", async () => {
    await renderWithRouter(<Home />);

    const shopLink = screen.getByText("Shop Now");
    expect(shopLink).toHaveAttribute("href", "/listings");
  });

  test("Sell Now button redirects to login when not authenticated", async () => {
    localStorage.removeItem("encomToken");
    await renderWithRouter(<Home />);

    const sellButton = screen.getByText("Sell Now");
    fireEvent.click(sellButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("Sell Now button redirects to new listing when authenticated", async () => {
    localStorage.setItem("encomToken", "fake-token");
    await renderWithRouter(<Home />);

    const sellButton = screen.getByText("Sell Now");
    fireEvent.click(sellButton);

    expect(mockNavigate).toHaveBeenCalledWith("/listings/new");
  });

  test("renders stats section", async () => {
    await renderWithRouter(<Home />);

    expect(screen.getByText("99.5%")).toBeInTheDocument();
    expect(screen.getByText("Satisfaction Rate")).toBeInTheDocument();
    expect(screen.getByText("1000+")).toBeInTheDocument();
    expect(screen.getByText("Orders Fulfilled")).toBeInTheDocument();
    expect(screen.getByText("500+")).toBeInTheDocument();
    expect(screen.getByText("Verified Sellers")).toBeInTheDocument();
  });

  test("handles API error gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error("API Error"));

    await renderWithRouter(<Home />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching popular items:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});
