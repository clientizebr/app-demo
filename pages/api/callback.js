import crypto from 'crypto';

let lastCallback = null;

export default function handler(req, res) {
  if (req.method === 'POST') {
    const signature = req.headers['x-clientize-signature'];
    const secret = process.env.CLIENTIZE_SIGNING_SECRET;

    let signatureValid = null;
    if (signature && secret) {
      const expected =
        'sha256=' +
        crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
      try {
        signatureValid = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
      } catch {
        signatureValid = false;
      }
    }

    lastCallback = {
      signature_valid: signatureValid,
      headers: {
        'x-clientize-signature': req.headers['x-clientize-signature'] || null,
        'x-clientize-timestamp': req.headers['x-clientize-timestamp'] || null,
        'x-clientize-event': req.headers['x-clientize-event'] || null,
      },
      body: req.body,
      received_at: new Date().toISOString(),
    };

    console.log('Installation callback received:', JSON.stringify(lastCallback, null, 2));
    return res.status(200).json({ ok: true });
  }

  // GET returns last callback
  return res.status(200).json(lastCallback || { message: 'No callback received yet' });
}
