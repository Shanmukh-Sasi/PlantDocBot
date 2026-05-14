import http from 'http';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const options = {
    hostname: '34.224.173.134',
    port: 80,
    path: '/predict',
    method: 'POST',
    headers: req.headers
  };

  // Delete the host header to avoid issues with the backend
  delete options.headers.host;

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy Error:', err);
    res.status(500).json({ error: 'Failed to connect to backend', details: err.message });
  });

  req.pipe(proxyReq);
}
