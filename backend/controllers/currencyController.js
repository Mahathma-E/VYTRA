import axios from 'axios';

// In-memory cache for exchange rates
// Structure: { key: `${from}_${to}`, rate: number, fetchedAt: epochMs }
const rateCache = new Map();

const DAY_MS = 24 * 60 * 60 * 1000;

function cacheKey(from, to) {
  return `${from.toUpperCase()}_${to.toUpperCase()}`;
}

async function fetchRateExternal(from, to) {
  // Use exchangerate.host free API
  const url = `https://api.exchangerate.host/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  const response = await axios.get(url, { timeout: 8000 });
  if (!response.data || typeof response.data.result !== 'number') {
    throw new Error('Failed to fetch exchange rate');
  }
  return response.data.result;
}

export async function getExchangeRate(req, res) {
  try {
    const from = (req.query.from || 'USD').toUpperCase();
    const to = (req.query.to || 'INR').toUpperCase();

    if (from === to) {
      return res.json({ from, to, rate: 1, cached: false, fetchedAt: Date.now() });
    }

    const key = cacheKey(from, to);
    const cached = rateCache.get(key);
    const now = Date.now();

    if (cached && now - cached.fetchedAt < DAY_MS) {
      return res.json({ from, to, rate: cached.rate, cached: true, fetchedAt: cached.fetchedAt });
    }

    const rate = await fetchRateExternal(from, to);
    rateCache.set(key, { rate, fetchedAt: now });
    // Also store the inverse for convenience
    const inverseKey = cacheKey(to, from);
    rateCache.set(inverseKey, { rate: 1 / rate, fetchedAt: now });

    res.json({ from, to, rate, cached: false, fetchedAt: now });
  } catch (error) {
    res.status(500).json({ message: 'Unable to get exchange rate', error: error.message });
  }
}


