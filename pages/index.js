import { useRouter } from 'next/router';
import { useState } from 'react';

const colors = {
  bg: '#f8fafc',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#1e293b',
  muted: '#64748b',
  primary: '#2563eb',
  success: '#16a34a',
  error: '#dc2626',
  purple: '#7c3aed',
  successBg: '#f0fdf4',
  successBorder: '#bbf7d0',
  errorBg: '#fef2f2',
  errorBorder: '#fca5a5',
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
    margin: '0 0 4px',
    color: colors.text,
  },
  cardDesc: {
    fontSize: 14,
    color: colors.muted,
    margin: '0 0 16px',
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
    transition: 'opacity 0.15s',
  }),
  btnDisabled: {
    padding: '8px 16px',
    background: '#cbd5e1',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    lineHeight: '20px',
    cursor: 'not-allowed',
  },
  badge: (bg, color) => ({
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: 500,
    background: bg,
    color: color,
  }),
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  infoItem: {
    padding: 12,
    background: colors.codeBg,
    borderRadius: 6,
    border: `1px solid ${colors.border}`,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: colors.muted,
    margin: '0 0 4px',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.text,
    margin: 0,
  },
};

export default function Home() {
  const router = useRouter();
  const { session_token } = router.query;
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);

  async function verifyToken() {
    if (!session_token) return;
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch('/api/verify-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: session_token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Falha na verificacao');
      } else {
        setVerifyResult(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  }

  function sendToast(message, type = 'success') {
    window.parent.postMessage(
      { type: 'clientize:toast', payload: { message, type } },
      '*'
    );
  }

  function navigate(path) {
    window.parent.postMessage(
      { type: 'clientize:navigate', payload: { path } },
      '*'
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={styles.headerTitle}>Clientize Extension Demo</h1>
          <p style={styles.headerSub}>
            App de exemplo para desenvolvedores de extensoes
          </p>
        </div>
      </div>

      <div style={styles.container}>
        {/* Session Token */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Session Token</h2>
          <p style={styles.cardDesc}>
            Token JWT recebido via query string quando o app e carregado no iframe.
          </p>

          <pre style={styles.pre}>
            {session_token || 'Nenhum token recebido (abra este app dentro da Clientize)'}
          </pre>

          <div style={{ marginTop: 12 }}>
            {session_token && !verifying ? (
              <button onClick={verifyToken} style={styles.btn(colors.primary)}>
                Verificar Token
              </button>
            ) : (
              <button disabled style={styles.btnDisabled}>
                {verifying ? 'Verificando...' : 'Verificar Token'}
              </button>
            )}
          </div>

          {error && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                background: colors.errorBg,
                border: `1px solid ${colors.errorBorder}`,
                borderRadius: 6,
                color: colors.error,
                fontSize: 14,
              }}
            >
              Erro: {error}
            </div>
          )}

          {verifyResult && (
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                  Resultado da Verificacao
                </h3>
                <span style={styles.badge(colors.successBg, colors.success)}>
                  Valido
                </span>
              </div>

              {verifyResult.data && (
                <div style={styles.infoGrid}>
                  {verifyResult.data.workspace && (
                    <div style={styles.infoItem}>
                      <p style={styles.infoLabel}>Workspace</p>
                      <p style={styles.infoValue}>{verifyResult.data.workspace.name || verifyResult.data.workspace.id}</p>
                    </div>
                  )}
                  {verifyResult.data.user && (
                    <div style={styles.infoItem}>
                      <p style={styles.infoLabel}>Usuario</p>
                      <p style={styles.infoValue}>{verifyResult.data.user.name || verifyResult.data.user.email}</p>
                    </div>
                  )}
                  {verifyResult.data.scopes && (
                    <div style={{ ...styles.infoItem, gridColumn: '1 / -1' }}>
                      <p style={styles.infoLabel}>Escopos</p>
                      <p style={styles.infoValue}>{verifyResult.data.scopes.join(', ')}</p>
                    </div>
                  )}
                </div>
              )}

              <details style={{ marginTop: 12 }}>
                <summary style={{ cursor: 'pointer', fontSize: 13, color: colors.muted }}>
                  Ver resposta completa
                </summary>
                <pre style={{ ...styles.pre, marginTop: 8 }}>
                  {JSON.stringify(verifyResult, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* App Bridge */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>App Bridge</h2>
          <p style={styles.cardDesc}>
            Comunique-se com o host Clientize via <code>postMessage</code>.
          </p>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: colors.muted, margin: '0 0 8px' }}>
              Toast
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => sendToast('Mensagem de sucesso enviada pelo app!')}
                style={styles.btn(colors.success)}
              >
                Enviar Toast (sucesso)
              </button>
              <button
                onClick={() => sendToast('Algo deu errado!', 'error')}
                style={styles.btn(colors.error)}
              >
                Enviar Toast (erro)
              </button>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: colors.muted, margin: '0 0 8px' }}>
              Navegacao
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/customers')}
                style={styles.btn(colors.purple)}
              >
                Ir para Clientes
              </button>
              <button
                onClick={() => navigate('/catalog-items')}
                style={styles.btn(colors.purple)}
              >
                Ir para Catalogo
              </button>
            </div>
          </div>
        </div>

        {/* Installation Callback */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Callback de Instalacao</h2>
          <p style={styles.cardDesc}>
            Dados recebidos quando o app foi instalado em um workspace.
          </p>
          <a
            href="/callback"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              color: colors.primary,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Ver dados do callback &rarr;
          </a>
        </div>

        {/* How it works */}
        <div style={{ ...styles.card, background: colors.codeBg, border: `1px solid ${colors.border}` }}>
          <h2 style={{ ...styles.cardTitle, fontSize: 14 }}>Como este app funciona</h2>
          <div style={{ fontSize: 13, color: colors.muted, lineHeight: 1.7 }}>
            <p style={{ margin: '0 0 8px' }}>
              <strong>1. Instalacao:</strong> A Clientize envia um POST para <code>/api/callback</code> com os dados
              da instalacao. A assinatura HMAC e verificada usando o Signing Secret.
            </p>
            <p style={{ margin: '0 0 8px' }}>
              <strong>2. Iframe:</strong> Quando aberto na Clientize, o app recebe um <code>session_token</code> na
              query string. Esse token e validado server-side via <code>/api/verify-session</code>.
            </p>
            <p style={{ margin: 0 }}>
              <strong>3. App Bridge:</strong> O app usa <code>postMessage</code> para enviar comandos ao host
              (toasts, navegacao).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
