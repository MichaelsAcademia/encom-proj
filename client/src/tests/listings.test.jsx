import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import ListingsPage from "../pages/listings/listings";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

global.fetch = jest.fn();

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
  writable: true
});

const mockListings = [
  {
    _id: "listing1",
    title: "Test Listing 1",
    price: 25.99,
    images: ["image1.jpg"]
  },
  {
    _id: "listing2",
    title: "Test Listing 2",
    price: 49.99,
    images: ["image2.jpg"]
  },
  {
    _id: "listing3",
    title: "Test Listing 3",
    price: 99.99,
    images: []
  }
];

const mockApiResponse = {
  listings: mockListings,
  total: 50
};

async function renderWithRouter(component, initialEntries = ["/"]) {
  let result;
  await act(async () => {
    result = render(
      <MemoryRouter initialEntries={initialEntries}>
        {component}
      </MemoryRouter>
    );
  });
  return result;
}

describe("Listings Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse
    });
  });

  test("renders listings header", async () => {
    await renderWithRouter(<ListingsPage />);

    expect(screen.getByText("Listings")).toBeInTheDocument();
  });

  test("shows loading state initially", async () => {
    fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    await act(async () => {
      render(
        <BrowserRouter>
          <ListingsPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("fetches and displays listings", async () => {
    await renderWithRouter(<ListingsPage />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("Test Listing 1")).toBeInTheDocument();
      expect(screen.getByText("Test Listing 2")).toBeInTheDocument();
      expect(screen.getByText("Test Listing 3")).toBeInTheDocument();
    });
  });

  test("displays correct results count", async () => {
    await renderWithRouter(<ListingsPage />);

    await waitFor(() => {
      expect(screen.getByText(/Results 1 - 20 of 50/)).toBeInTheDocument();
    });
  });

  test("displays listing prices", async () => {
    await renderWithRouter(<ListingsPage />);

    await waitFor(() => {
      expect(screen.getByText("$25.99")).toBeInTheDocument();
      expect(screen.getByText("$49.99")).toBeInTheDocument();
      expect(screen.getByText("$99.99")).toBeInTheDocument();
    });
  });

  test("renders pagination controls", async () => {
    await renderWithRouter(<ListingsPage />);

    await waitFor(() => {
      expect(screen.getByText("<")).toBeInTheDocument();
      expect(screen.getByText(">")).toBeInTheDocument();
      expect(screen.getByText("Page 1")).toBeInTheDocument();
    });
  });

  test("previous button is disabled on first page", async () => {
    await renderWithRouter(<ListingsPage />, ["/listings?page=1"]);

    await waitFor(() => {
      const prevButton = screen.getByText("<");
      expect(prevButton).toHaveAttribute("data-disabled", "true");
    });
  });

  test("fetches listings with correct API parameters", async () => {
    await renderWithRouter(<ListingsPage />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/v1/listings")
      );
    });
  });

  test("handles page 2 correctly", async () => {
    await renderWithRouter(<ListingsPage />, ["/listings?page=2"]);

    await waitFor(() => {
      expect(screen.getByText("Page 2")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("offset=20")
      );
    });
  });

  test("handles API error gracefully", async () => {
    fetch.mockResolvedValueOnce({
      ok: false
    });

    await renderWithRouter(<ListingsPage />);

    // Component should handle error state (not crash)
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  test("scrolls to top on page change", async () => {
    await renderWithRouter(<ListingsPage />);

    await waitFor(() => {
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });
  });

  test("listings link to detail pages", async () => {
    await renderWithRouter(<ListingsPage />);

    await waitFor(() => {
      const listingLinks = screen.getAllByRole("link");
      // Filter to only listing links (not pagination)
      const productLinks = listingLinks.filter(link => 
        link.getAttribute("href")?.includes("/listing/")
      );
      expect(productLinks.length).toBeGreaterThan(0);
      expect(productLinks[0]).toHaveAttribute("href", "/listing/listing1");
    });
  });

  test("handles sort parameter for new arrivals", async () => {
    await renderWithRouter(<ListingsPage />, ["/listings?page=1&sort=new"]);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("sort=true")
      );
    });
  });
});
