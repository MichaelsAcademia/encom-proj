import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './order-details.css';

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('encomToken');
        const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };

        const res = await fetch(`/api/v1/orders/${orderId}`, { headers });
        if (!res.ok) return console.warn('Order fetch failed', res.status);
        const data = await res.json();

        const cache = {};
        const fetchListing = async (id) => {
          if (!id) return null;
          if (cache[id]) return cache[id];
          try {
            const r = await fetch(`/api/v1/listings/${id}`, { headers });
            if (!r.ok) return null;
            const l = await r.json();
            const small = { id: l._id || l.id, title: l.title || l.name, img: (l.images && l.images[0]) || l.image || null, price: l.price || l.amount || null };
            cache[id] = small;
            return small;
          } catch { return null; }
        };

        for (const item of data.items || []) {
          const lid = item.listingId || item.productId || item.id || item._id;
          if (!lid) continue;
          const listing = await fetchListing(lid);
          if (listing) item.listing = listing;
        }

        setOrder(data);
      } catch (err) { console.error('Could not fetch order', err); }
    };

    fetchOrder();
  }, [orderId]);

  const parsePrice = (p) => {
    if (p == null) return 0;
    if (typeof p === 'number') return p;
    const cleaned = String(p).replace(/[^0-9.\-]/g, '');
    const num = parseFloat(cleaned);
    return Number.isFinite(num) ? num : 0;
  };

  const formatCurrency = (n) => `$${Number(n || 0).toFixed(2)}`;

  const show = order || { _id: orderId, items: [] };

  // Use order.total when present; fallback to summed item prices
  const computedTotalNumber = parsePrice(show.total || show.orderTotal || (show.items && show.items.reduce((s, it) => s + parsePrice((it.listing && it.listing.price) || it.price), 0)));
  const orderTotal = formatCurrency(computedTotalNumber);

  return (
    <div className="orders-details">
      <div className="od-header">
        <h1 className="od-title">Order Details</h1>
        <div className="od-sub">Order #{show._id}</div>
      </div>
      <div className="order-card summary-card">
        <div className="order-card-row">
          <div className="summary-col">
            <div className="summary-title">Order Summary</div>
            <div className="summary-row"><div>Item(s) Subtotal:</div><div>{orderTotal}</div></div>
            <div className="summary-row"><div>Total Before Tax:</div><div>{orderTotal}</div></div>
            <div className="summary-row"><div>Tax (GST/HST):</div><div>{formatCurrency(0)}</div></div>
            <div className="summary-row total"><div>Total for this Order:</div><div>{orderTotal}</div></div>
          </div>
        </div>
      </div>

      <div className="spacer" />

      <div className="order-card items-card">
        {(show.items || []).map((it, i) => {
          const listing = it.listing || {};
          const img = (listing && listing.img) || it.img;
          const title = (listing && listing.title) || it.title;
          const price = formatCurrency(parsePrice((listing && listing.price) || it.price || show.total));
          return (
            <div key={it._id || it.id || listing.id || i} className="product-row">
              <div className="product-image"><img src={img} alt={title} /></div>
              <div className="product-info">
                <div className="product-title">{title}</div>
                {it.subtitle && <div className="product-sub">{it.subtitle}</div>}
                <div className="product-price">{price}</div>
              </div>
              <div className="product-action">
                <Link to={`/reviews?product=${listing.id}`} className="review-btn">Write a product review</Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
