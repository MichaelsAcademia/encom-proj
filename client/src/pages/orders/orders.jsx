import {useState, useEffect} from 'react';
import {Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './orders.css';

export default function OrdersPage({ user }){
    const [notShipped, setNotShipped] = useState(false);

    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.id) {
            console.log('No user found');
            return;
        }

        const fetchOrders = async () => {

            console.log("Fetching orders for user:", user);

          try {
            const token = localStorage.getItem('encomToken');
            if (!token) return navigate('/login');

            const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
            const userId = user.id;

            const response = await axios.get(`/api/v1/orders/user/${userId}`, { headers });
            const data = response.data;

            const listingCache = {};
            const fetchListing = async (id) => {
              if (!id) return null;
              if (listingCache[id]) return listingCache[id];
              try {
                const r = await fetch(`/api/v1/listings/${id}`, { headers });
                if (!r.ok) return null;
                const l = await r.json();
                const small = { id: l._id, title: l.title, img: l.images, price: l.price, subtitle: l.subtitle };
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
    }, [user, navigate]);

    //Format date
    const formatDate = (v) => {
        if (!v) return '';
        const d = new Date(v);
        if (Number.isNaN(d.getTime())) return v;
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    const handleSwitch = () => {
        setNotShipped(!notShipped);
    }

    return (
        <div className="orders-page">
                <h1 className="page-title">Your Orders</h1>
                {/* <div className="orders-status">
                    <Link className={notShipped ? "" : "active"} onClick={handleSwitch}>Orders</Link>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Link className={notShipped ? "active" : ""} onClick={handleSwitch}>Not Yet Shipped</Link>
                </div> */}
                <div className="divider" />
                <div className="orders-summary">{orders.length} order{orders.length == 0 ? "s" : ""} placed</div>
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
                                const img = listing.img[0] || 'https://placehold.co/400?text=No%20Image';
                                const title = listing.title || item.title || 'Item';
                                return (
                                    <div className="product-row" key={item._id || item.id || listing.id || `${order._id}-${idx}`}>
                                        <div className="product-image">
                                            <img src={img} alt={title} />
                                        </div>
                                        <div className="product-info">
                                            <div className="product-title-price">
                                                <h2>{listing.title}</h2>
                                                <p>${listing.price}</p>
                                            </div>
                                            <p>x{item.quantity}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
