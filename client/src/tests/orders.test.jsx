import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrdersPage from '../pages/orders/orders';
import axios from 'axios';

//Mock axios
jest.mock('axios');

//Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

//Silence console logs during tests
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

//Mock fetch 
global.fetch = jest.fn();

describe('OrdersPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    Storage.prototype.getItem = jest.fn(() => 'mockToken');
  });

  test('renders orders for a user', async () => {
    const mockUser = {
      id: 'user123',
      name: 'Test User',
      email: 'testuser@example.com'
    };

    const mockOrder = {
      _id: 'order123',
      items: [
        { listingId: 'listing123',
          quantity: 2,
          priceAtCheckout: 50 
        }
      ],
      total: 100,
      status: 'ordered',
      createdAt: '2025-01-01T12:00:00.000Z',
      updatedAt: '2025-01-01T12:00:00.000Z'
    };

    // axios should return an array of orders in `data`
    axios.get.mockResolvedValue({ data: [mockOrder] });

    // fetch for listing details
    global.fetch.mockResolvedValue({ 
      ok: true,
      json: async () => ({ 
        _id: 'listing123', 
        title: 'Example Product', 
        price: 50,
        images: ['img1.jpg']
      })
    });

    render(
      <MemoryRouter>
        <OrdersPage user={mockUser} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Your Orders/i)).toBeInTheDocument();
      expect(screen.getByText(/1 order placed/i)).toBeInTheDocument();
      expect(screen.getByText(/Example Product/i)).toBeInTheDocument();
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/listings/listing123', expect.any(Object));
    });
  });

  test('does NOT fetch when no user is provided', () => {
    render(
      <MemoryRouter>
        <OrdersPage user={null} />
      </MemoryRouter>
    );

    expect(axios.get).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
