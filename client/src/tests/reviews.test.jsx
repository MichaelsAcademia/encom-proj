import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ReviewsPage from '../pages/orders/reviews';
import axios from 'axios';

//Mock axios
jest.mock('axios');

const mockNavigate = jest.fn();

// Mock useNavigate and useSearchParams
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [
    new URLSearchParams({
      order: 'order123',
      listing: 'listing123',
      product: 'Test Product'
    })
  ]
}));

//Mock fetch
global.fetch = jest.fn();

describe('ReviewsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    Storage.prototype.getItem = jest.fn(() => 'mockToken');
  });

  test('renders product title, allows rating/comment input, and submits review', async () => {
    const initial = '/review?order=order123&listing=listing123&product=Test%20Product';
    axios.get.mockResolvedValue({ data: { sellerId: 'seller123', title: 'Test Product' } });
    fetch.mockResolvedValue({ ok: true });

    render(
      <MemoryRouter initialEntries={[initial]}>
        <Routes>
          <Route path="/review" element={<ReviewsPage user={{ id: 'user123' }} />} />
        </Routes>
      </MemoryRouter>
    );

    // Title and product
    await waitFor(() => expect(screen.getByRole('heading', { name: /Review/i })).toBeInTheDocument());
    expect(screen.getByText(/Test Product/i)).toBeInTheDocument();

    // Select a rating 
    const stars = await screen.findAllByText('★');
    fireEvent.click(stars[4]);

    // Write a comment
    const textarea = screen.getByPlaceholderText(/What should other customers know\?/i);
    fireEvent.change(textarea, { target: { value: 'Nice product' } });
    expect(textarea.value).toBe('Nice product');

    // Submit the form
    const submit = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submit);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('/api/v1/reviews', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: expect.any(String)
      }));

      const calledBody = JSON.parse(fetch.mock.calls[0][1].body);
      expect(calledBody).toMatchObject({
        reviewerId: 'user123',
        sellerId: 'seller123',
        orderId: 'order123',
        rating: 5,
        comment: 'Nice product'
      });
    });
  });
});
