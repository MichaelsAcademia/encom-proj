import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Footer } from "../components/Global/Footer";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate
}));

async function renderWithRouter(component) {
  let result;
  await act(async () => {
    result = render(<BrowserRouter>{component}</BrowserRouter>);
  });
  return result;
}

describe("Footer Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all section headings", async () => {
    await renderWithRouter(<Footer isAuthenticated={false} username={null} />);

    expect(screen.getByText("Shop")).toBeInTheDocument();
    expect(screen.getByText("Sell")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
  });

  test("renders Shop section links", async () => {
    await renderWithRouter(<Footer isAuthenticated={false} username={null} />);

    expect(screen.getByText("All Products")).toBeInTheDocument();
    expect(screen.getByText("New Arrivals")).toBeInTheDocument();

    const allProductsLink = screen.getByText("All Products");
    expect(allProductsLink).toHaveAttribute("href", "/listings");

    const newArrivalsLink = screen.getByText("New Arrivals");
    expect(newArrivalsLink).toHaveAttribute("href", "/listings?page=1&sort=new");
  });

  test("renders Sell section links", async () => {
    await renderWithRouter(<Footer isAuthenticated={false} username={null} />);

    expect(screen.getByText("Start Selling")).toBeInTheDocument();
    expect(screen.getByText("Seller F.A.Q")).toBeInTheDocument();

    const sellerFaqLink = screen.getByText("Seller F.A.Q");
    expect(sellerFaqLink).toHaveAttribute("href", "/faq?seller=true");
  });

  test("renders Account section links", async () => {
    await renderWithRouter(<Footer isAuthenticated={false} username={null} />);

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByText("Cart")).toBeInTheDocument();
    expect(screen.getByText("Order History")).toBeInTheDocument();
    expect(screen.getByText("Account Settings")).toBeInTheDocument();

    const cartLink = screen.getByText("Cart");
    expect(cartLink).toHaveAttribute("href", "/cart");

    const orderHistoryLink = screen.getByText("Order History");
    expect(orderHistoryLink).toHaveAttribute("href", "/orders");
  });

  test("renders Contact Us section links", async () => {
    await renderWithRouter(<Footer isAuthenticated={false} username={null} />);

    expect(screen.getByText("Email Support")).toBeInTheDocument();
    expect(screen.getByText("Phone Support")).toBeInTheDocument();
    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
    expect(screen.getByText("Terms and Conditions")).toBeInTheDocument();

    const faqLink = screen.getByText("Frequently Asked Questions");
    expect(faqLink).toHaveAttribute("href", "/faq");

    const tosLink = screen.getByText("Terms and Conditions");
    expect(tosLink).toHaveAttribute("href", "/tos");
  });

  test("renders copyright text", async () => {
    await renderWithRouter(<Footer isAuthenticated={false} username={null} />);

    expect(screen.getByText("© Encom 2025")).toBeInTheDocument();
  });

  test("Sign In navigates to login when not authenticated", async () => {
    await renderWithRouter(<Footer isAuthenticated={false} username={null} />);

    const signInLink = screen.getByText("Sign In");
    fireEvent.click(signInLink);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("Sign In shows alert when already authenticated", async () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    await renderWithRouter(<Footer isAuthenticated={true} username="testuser" />);

    const signInLink = screen.getByText("Sign In");
    fireEvent.click(signInLink);

    expect(alertMock).toHaveBeenCalledWith("You are already logged in as testuser");
    expect(mockNavigate).not.toHaveBeenCalledWith("/login");

    alertMock.mockRestore();
  });

  test("email support link has correct mailto href", async () => {
    await renderWithRouter(<Footer isAuthenticated={false} username={null} />);

    const emailLink = screen.getByText("Email Support");
    expect(emailLink).toHaveAttribute(
      "href",
      "mailto:test@email.com?subject=Fake%20Email&body=Don%27t%20use%20this%20email"
    );
  });
});
