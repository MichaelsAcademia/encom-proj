import {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './orders.css';

export default function OrdersPage(){
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
          try {
            const token = localStorage.getItem('encomToken');
            if (!token) return navigate('/login');

            const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
            const res = await fetch('/api/v1/orders', { headers });
            if (!res.ok) return console.error('Failed to load orders');
            const data = await res.json();

            const listingCache = {};
            const fetchListing = async (id) => {
              if (!id) return null;
              if (listingCache[id]) return listingCache[id];
              try {
                const r = await fetch(`/api/v1/listings/${id}`, { headers });
                if (!r.ok) return null;
                const l = await r.json();
                const small = { id: l._id, title: l.title, img: l.images };
                listingCache[id] = small;
                return small;
              } catch { return null; }
            };

            for (const order of data || []) {
              if (!order.items) continue;
              for (const item of order.items) {
                const lid = item.listingId || item.productId || item.id || item._id;
                if (!lid) continue;
                const listing = await fetchListing(lid);
                if (listing) item.listing = listing;
              }
            }

            setOrders(data);
          } catch (err) { console.error('Error fetching orders:', err); }
        };
        fetchOrders();
    }, [navigate])

    //Format date
    const formatDate = (v) => {
        if (!v) return '';
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) return v;
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    return (
        <div className="orders-page">
                <h1 className="page-title">Your Orders</h1>
                <div className="orders-status">
                    <Link to="/orders">Orders</Link>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Link to="/orders">Not Yet Shipped</Link>
                </div>
                <div className="orders-summary">{orders.length} orders placed</div>
                <div className="orders-list">
                {orders.map((order) => (
                    <div className="order-card" key={order._id || order.id}>
                        <div className="order-card-body">
                        <div className="order-card-meta">
                            <div className="meta-left">
                                <div className="meta-label">ORDER PLACED</div>
                                <div className="meta-value">{formatDate(order.createdAt)}</div>
                            </div>
                            <div className="meta-center">
                                <div className="meta-label">TOTAL</div>
                                <div className="meta-value">${order.total}</div>
                            </div>
                            <div className="meta-right">
                                <div className="order-number">ORDER #{order._id}</div>
                                <Link className="view-details" to={`/orders/${order._id}`}>View order details</Link>
                            </div>
                        </div>
                            {(order.items || []).map((item, idx) => {
                                const listing = item.listing || {};
                                const img = listing.img || item.img || '/assets/placeholder.png';
                                const title = listing.title || item.title || 'Item';
                                return (
                                    <div className="product-row" key={item._id || item.id || listing.id || `${order._id}-${idx}`}>
                                        <div className="product-image">
                                            <img src={img} alt={title} />
                                        </div>
                                        <div className="product-info">
                                            <div className="product-title">{title}</div>
                                            {item.subtitle && <div className="product-sub">{item.subtitle}</div>}
                                        </div>
                                        <div className="product-actions">
                                            <Link to="/reviews" className="review-btn">Write a product review</Link>
                                        </div>
                                    </div>
                                    )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
