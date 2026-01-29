import { useState } from 'react';
import { createPaste } from '../api/pastebin.js';

export default function CreatePaste() {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const data = { content: content.trim() };
      if (ttlSeconds) data.ttl_seconds = Number(ttlSeconds);
      if (maxViews) data.max_views = Number(maxViews);

      const response = await createPaste(data);
      setResult(response.url);
    } catch (err) {
      setError(err.error || 'Failed to create paste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Pastebin Lite</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Content * (required)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              resize: 'vertical'
            }}
            placeholder="Enter your text here..."
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label>TTL (seconds, optional)</label>
            <input
              type="number"
              min="1"
              value={ttlSeconds}
              onChange={(e) => setTtlSeconds(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Max views (optional)</label>
            <input
              type="number"
              min="1"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !content.trim()}
          style={{
            width: '100%',
            padding: '12px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating...' : 'Create Paste'}
        </button>
      </form>

      {error && (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          background: '#f8d7da', 
          color: '#721c24', 
          borderRadius: '4px' 
        }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ 
          marginTop: '24px', 
          padding: '20px', 
          background: '#d4edda', 
          borderRadius: '8px' 
        }}>
          <p><strong>Your paste is ready!</strong></p>
          <p style={{ wordBreak: 'break-all' }}>{result}</p>
          <a 
            href={result} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '8px',
              padding: '8px 16px',
              background: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Open Paste
          </a>
        </div>
      )}
    </div>
  );
}
