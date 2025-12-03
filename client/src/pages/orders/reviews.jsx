import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './reviews.css';

export default function ReviewsPage({ user }){
  const navigate = useNavigate();

  const [ params ] = useSearchParams();
  const queryOrderId = params.get("order");
  const queryListingId = params.get("listing");
  const queryProductTitle = params.get("product");

  const [sellerId, setSellerId] = useState("");
  const [listing, setListing] = useState({});
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Fetch listing details to get sellerId
    const fetchSeller = async () => {
      try {
        const response = await axios.get(`/api/v1/listings/${queryListingId}`);

        setSellerId(response.data.sellerId);
        setListing(response.data);
      } catch (err) {
        console.error('Failed to fetch listing details', err);
      }
    };
    fetchSeller();
  }, [queryListingId]);

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const token = localStorage.getItem('encomToken');
      if (!token) return navigate('/login');

      const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
      const body = {
        reviewerId: user.id,
        sellerId,
        orderId: queryOrderId,
        rating,
        comment
      };
      const res = await fetch('/api/v1/reviews', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error('Failed to submit review');
      setStatus({ ok: true });
    } catch (err) { setStatus({ error: err.message }); }

    navigate(`/orders/${queryOrderId}`);
  };

  return (
    <div className="reviews-page">
      <div className='review-title'>
        <h1>Review</h1>
        <h2>{queryProductTitle}</h2>
      </div>
      <div className='divider'/>
      <form onSubmit={submit} className="reviews-form">
        <label>Rating</label>
        <div className="reviews-stars">
          {[1,2,3,4,5].map(n => (
            <button key={n} type="button" onClick={() => setRating(n)} className={`star ${n <= rating ? 'filled' : ''}`}>{'★'}</button>
          ))}
        </div>

        <label className="reviews-label">Write a review <span className="reviews-required">(required)</span></label>
        <textarea required value={comment} onChange={e=>setComment(e.target.value)} rows={6} className="reviews-textarea" placeholder="What should other customers know?" />

        <div className="reviews-actions">
          <button type="submit" disabled={status === 'loading'} className="reviews-submit">Submit</button>
        </div>

        {status && status.error && <div className="reviews-error">{status.error}</div>}
        {status && status.ok && <div className="reviews-ok">Review submitted — redirecting...</div>}
      </form>
    </div>
  )
}
