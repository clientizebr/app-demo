process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const CLIENTIZE_URL = process.env.CLIENTIZE_URL || 'https://app.clientize.test';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session_token } = req.body;

  if (!session_token) {
    return res.status(400).json({ error: 'session_token is required' });
  }

  try {
    // 1. Verificar o session token para obter o workspace_id
    const verifyRes = await fetch(`${CLIENTIZE_URL}/api/v1/session/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: session_token }),
    });

    if (!verifyRes.ok) {
      return res.status(401).json({ error: 'Session token inválido' });
    }

    const { data: session } = await verifyRes.json();

    // 2. Usar client_credentials para obter um access token
    const tokenRes = await fetch(`${CLIENTIZE_URL}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: process.env.CLIENTIZE_CLIENT_ID || '',
        client_secret: process.env.CLIENTIZE_CLIENT_SECRET || '',
        scope: 'catalog:read',
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      return res.status(500).json({
        error: 'Falha ao obter access token',
        detail: err,
        hint: 'Verifique CLIENTIZE_CLIENT_ID e CLIENTIZE_CLIENT_SECRET no .env.local',
      });
    }

    const { access_token } = await tokenRes.json();

    // 3. Buscar os itens de catálogo usando a API
    const catalogRes = await fetch(`${CLIENTIZE_URL}/api/v1/catalog-items?per_page=10&sort=-created_at`, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Accept': 'application/json',
        'X-Clientize-Workspace-Id': String(session.workspace_id),
      },
    });

    if (!catalogRes.ok) {
      const err = await catalogRes.text();
      return res.status(500).json({
        error: 'Falha ao buscar catálogo',
        detail: err,
      });
    }

    const catalog = await catalogRes.json();

    return res.status(200).json({
      workspace: session.workspace,
      items: catalog.data || [],
      total: catalog.meta?.total || 0,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
