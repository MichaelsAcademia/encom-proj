import { useState } from 'react';
import './reviews.css';

export default function ReviewsPage(){
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try{
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
      const body = { orderId, sellerId, listingId, rating, comment };
      const res = await fetch('/api/v1/reviews', { method: 'POST', headers, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Failed to submit review');
      setStatus({ ok: true });
    } catch (err) { setStatus({ error: err.message }); }
  };

  return (
    <div className="reviews-page">
      <h1 className="reviews-title">Review</h1>
      <form onSubmit={submit} className="reviews-form">
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
