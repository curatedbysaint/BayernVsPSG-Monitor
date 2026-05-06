export default async function handler(req, res) {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter required' });
  }

  const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
  
  if (!BEARER_TOKEN) {
    return res.status(500).json({ error: 'Twitter API token not configured' });
  }

  try {
    const response = await fetch(
      `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=10&tweet.fields=created_at,public_metrics,author_id&expansions=author_id&user.fields=username,verified`,
      {
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch tweets' });
  }
}
