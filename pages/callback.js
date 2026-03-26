import { useState, useEffect } from 'react';

const colors = {
  bg: '#f8fafc',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#1e293b',
  muted: '#64748b',
  primary: '#2563eb',
  success: '#16a34a',
  error: '#dc2626',
  successBg: '#f0fdf4',
  successBorder: '#bbf7d0',
  errorBg: '#fef2f2',
  errorBorder: '#fca5a5',
  warningBg: '#fefce8',
  warningBorder: '#fde68a',
  warningText: '#92400e',
  codeBg: '#f1f5f9',
};

const styles = {
  page: {
    minHeight: '100vh',
    background: colors.bg,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: colors.text,
  },
  header: {
    background: colors.card,
    borderBottom: `1px solid ${colors.border}`,
    padding: '20px 24px',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
    color: colors.text,
  },
  headerSub: {
    fontSize: 14,
    color: colors.muted,
    margin: '4px 0 0',
  },
  container: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '0 24px 48px',
  },
  card: {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    padding: 24,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    margin: '0 0 16px',
    color: colors.text,
  },
  pre: {
    background: colors.codeBg,
    padding: 12,
    borderRadius: 6,
    overflow: 'auto',
    fontSize: 12,
    lineHeight: 1.5,
    border: `1px solid ${colors.border}`,
    margin: 0,
    wordBreak: 'break-all',
    whiteSpace: 'pre-wrap',
  },
  btn: (bg) => ({
    padding: '8px 16px',
    cursor: 'pointer',
    background: bg,
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    lineHeight: '20px',
  }),
  badge: (bg, color, borderColor) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: 600,
    background: bg,
    color: color,
    border: `1px solid ${borderColor}`,
  }),
  label: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: colors.muted,
    margin: '0 0 6px',
  },
};

export default function Callback() {
  const [callbackData, setCallbackData] = useState(null);
  const [loading, setLoading] = useState(true);

  function fetchData() {
    setLoading(true);
    fetch('/api/callback')
      .then((res) => res.json())
      .then((data) => {
        setCallbackData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => {
    fetchData();
  }, []);

  const hasCallback = callbackData && !callbackData.message;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={styles.headerTitle}>Callback de Instalacao</h1>
          <p style={styles.headerSub}>
            Dados recebidos do webhook de instalacao da Clientize
          </p>
        </div>
      </div>

      <div style={styles.container}>
        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button onClick={fetchData} style={styles.btn(colors.primary)}>
            Atualizar
          </button>
          <a
            href="/"
            style={{
              color: colors.primary,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            &larr; Voltar para Home
          </a>
        </div>

        {loading ? (
          <div style={styles.card}>
            <p style={{ color: colors.muted, margin: 0 }}>Carregando...</p>
          </div>
        ) : !hasCallback ? (
          <div
            style={{
              padding: 20,
              background: colors.warningBg,
              border: `1px solid ${colors.warningBorder}`,
              borderRadius: 8,
              color: colors.warningText,
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <strong>Nenhum callback recebido.</strong>
            <br />
            Instale o app em um workspace pela Clientize para receber o webhook de instalacao.
          </div>
        ) : (
          <>
            {/* Signature Status */}
            <div style={styles.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <p style={styles.label}>Verificacao da Assinatura</p>
                  {callbackData.signature_valid === true ? (
                    <span style={styles.badge(colors.successBg, colors.success, colors.successBorder)}>
                      Assinatura valida
                    </span>
                  ) : callbackData.signature_valid === false ? (
                    <span style={styles.badge(colors.errorBg, colors.error, colors.errorBorder)}>
                      Assinatura invalida
                    </span>
                  ) : (
                    <span style={styles.badge(colors.warningBg, colors.warningText, colors.warningBorder)}>
                      Nao verificada (configure CLIENTIZE_SIGNING_SECRET)
                    </span>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={styles.label}>Recebido em</p>
                  <p style={{ fontSize: 14, fontWeight: 500, margin: 0, color: colors.text }}>
                    {callbackData.received_at}
                  </p>
                </div>
              </div>
            </div>

            {/* Headers */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Headers</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(callbackData.headers || {}).map(([key, value]) => (
                  <div key={key} style={{ padding: 10, background: colors.codeBg, borderRadius: 6, border: `1px solid ${colors.border}` }}>
                    <p style={{ ...styles.label, margin: '0 0 2px' }}>{key}</p>
                    <p style={{ fontSize: 13, margin: 0, fontFamily: 'monospace', wordBreak: 'break-all' }}>
                      {value || <span style={{ color: colors.muted, fontStyle: 'italic' }}>nao enviado</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Body */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Body</h2>
              <pre style={styles.pre}>
                {JSON.stringify(callbackData.body, null, 2)}
              </pre>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
