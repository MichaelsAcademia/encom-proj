import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Navbar } from "../components/Global/Navbar";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

const mockUser = {
  id: "12345",
  username: "testuser",
  email: "test@example.com"
};

async function renderWithRouter(component) {
  let result;
  await act(async () => {
    result = render(<BrowserRouter>{component}</BrowserRouter>);
  });
  return result;
}

describe("Navbar Component", () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders logo with link to home", async () => {
    await renderWithRouter(<Navbar user={null} logout={mockLogout} />);

    const logo = screen.getByText("ENCOM");
    expect(logo).toBeInTheDocument();
    expect(logo.closest("a")).toHaveAttribute("href", "/");
  });

  test("renders search input", async () => {
    await renderWithRouter(<Navbar user={null} logout={mockLogout} />);

    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  test("renders Listings button", async () => {
    await renderWithRouter(<Navbar user={null} logout={mockLogout} />);

    expect(screen.getByText("Listings")).toBeInTheDocument();
  });

  test("Listings button navigates to /listings", async () => {
    await renderWithRouter(<Navbar user={null} logout={mockLogout} />);

    const listingsButton = screen.getByText("Listings").closest("button");
    fireEvent.click(listingsButton);

    expect(mockNavigate).toHaveBeenCalledWith("/listings");
  });

  test("shows sign in button when user is not logged in", async () => {
    await renderWithRouter(<Navbar user={null} logout={mockLogout} />);

    // Should not show username
    expect(screen.queryByText("Testuser")).not.toBeInTheDocument();
  });

  test("sign in button navigates to login", async () => {
    await renderWithRouter(<Navbar user={null} logout={mockLogout} />);

    // Find all buttons and click the one that should navigate to login
    const buttons = screen.getAllByRole("button");
    const loginButton = buttons[buttons.length - 1]; // Last button when not logged in
    fireEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("shows username when user is logged in", async () => {
    await renderWithRouter(<Navbar user={mockUser} logout={mockLogout} />);

    // Username should be capitalized
    expect(screen.getByText("Testuser")).toBeInTheDocument();
  });

  test("cart button navigates to /cart", async () => {
    await renderWithRouter(<Navbar user={mockUser} logout={mockLogout} />);

    // Find and click cart button (4th button after listings for logged in user)
    const buttons = screen.getAllByRole("button");
    // Cart is the 4th button (index 3) for logged in users
    fireEvent.click(buttons[3]);

    expect(mockNavigate).toHaveBeenCalledWith("/cart");
  });

  test("orders button navigates to /orders", async () => {
    await renderWithRouter(<Navbar user={mockUser} logout={mockLogout} />);

    const buttons = screen.getAllByRole("button");
    // Orders is the 5th button (index 4) for logged in users
    fireEvent.click(buttons[4]);

    expect(mockNavigate).toHaveBeenCalledWith("/orders");
  });

  test("logout button calls logout function and navigates to home", async () => {
    await renderWithRouter(<Navbar user={mockUser} logout={mockLogout} />);

    const buttons = screen.getAllByRole("button");
    // Logout is the last button for logged in users
    fireEvent.click(buttons[buttons.length - 1]);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
