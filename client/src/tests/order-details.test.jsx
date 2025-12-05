import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import OrderDetails from '../pages/orders/order-details';

//Mock axios
jest.mock('axios');

//Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

//Mock fetch 
global.fetch = jest.fn();

describe('OrderDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    Storage.prototype.getItem = jest.fn(() => 'mockToken');
  });

  test('renders order details with items', async () => {
    const mockOrderId = 'order123';

    const mockListing = {
      _id: 'listing123',
      title: 'Example Product',
      price: 50,
      images: ['image1.jpg']
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockListing
    });

    render(
      <MemoryRouter initialEntries={[`/orders/${mockOrderId}`]}>
        <Routes>
          <Route path="/orders/:orderId" element={<OrderDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Order Details/i)).toBeInTheDocument();
      expect(screen.getByText(/Order #order123/i)).toBeInTheDocument();
    });
  });
});