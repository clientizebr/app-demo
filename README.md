# Clientize Extension Demo

App de exemplo que demonstra como construir uma extensao para a plataforma Clientize.

<!-- ![Screenshot](screenshot.png) -->

## O que este app demonstra

- **Verificacao de session token** -- valida o token JWT da sessao do iframe via API da Clientize
- **Comunicacao via App Bridge** -- envia comandos `postMessage` para o host (toast, navigate)
- **Callback de instalacao** -- recebe e verifica o webhook POST enviado quando o app e instalado
- **Padrao de integracao com a API** -- proxy server-side para chamadas autenticadas a API da Clientize

## Pre-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- Uma conta de parceiro na Clientize com acesso ao portal de parceiros
- Um workspace de teste para instalar o app

## Configuracao

### 1. Clone o repositorio

```bash
git clone https://github.com/clientize/clientize-extension-demo.git
cd clientize-extension-demo
```

### 2. Instale as dependencias

```bash
npm install
```

### 3. Configure as variaveis de ambiente

Copie o arquivo de exemplo e preencha com as credenciais do seu app:

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
CLIENTIZE_URL=https://app.clientize.test
CLIENTIZE_CLIENT_SECRET=seu_client_secret_aqui
CLIENTIZE_SIGNING_SECRET=seu_signing_secret_aqui
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

O app vai rodar em **http://localhost:3001**.

### 5. Registre o app na Clientize

No portal de parceiros da Clientize, crie um novo app com:

| Campo | Valor |
|-------|-------|
| **URL do App** | `http://localhost:3001` |
| **URL de Callback** | `http://localhost:3001/api/callback` |

Depois, instale o app em um workspace de teste.

## Estrutura do projeto

```
pages/
  index.js              Pagina principal -- exibe o session token,
                        botao de verificacao e controles do App Bridge
  callback.js           Pagina que exibe os dados do ultimo callback
                        de instalacao recebido
  api/
    callback.js         Endpoint que recebe o webhook POST de instalacao
                        e verifica a assinatura HMAC
    verify-session.js   Proxy server-side que valida o session token
                        chamando a API da Clientize
.env.example            Modelo das variaveis de ambiente necessarias
next.config.js          Configuracao do Next.js
package.json            Dependencias e scripts
```

## Como funciona

### Callback de instalacao

Quando um usuario instala seu app, a Clientize envia um `POST` para a URL de callback configurada. O payload contem os dados da instalacao (workspace, usuario, escopos). O header `X-Clientize-Signature` permite verificar que a requisicao realmente veio da Clientize usando HMAC-SHA256 com o Signing Secret.

```
Clientize --POST--> /api/callback --verifica HMAC--> armazena dados
```

### Session token (iframe)

Quando o app e aberto dentro da Clientize, ele carrega em um iframe com o parametro `?session_token=...`. Esse token JWT identifica o workspace e o usuario. O app envia o token para seu proprio backend (`/api/verify-session`), que faz uma chamada server-side para a API da Clientize validar o token.

```
iframe (?session_token=xxx) --> /api/verify-session --> Clientize API /api/v1/session/verify
```

### App Bridge (postMessage)

O app pode se comunicar com o host Clientize enviando mensagens via `window.parent.postMessage`. Comandos disponiveis:

| Tipo | Descricao |
|------|-----------|
| `clientize:toast` | Exibe uma notificacao toast na interface do host |
| `clientize:navigate` | Navega para uma rota dentro da Clientize |

## Variaveis de ambiente

| Variavel | Descricao |
|----------|-----------|
| `CLIENTIZE_URL` | URL base da Clientize (sem barra no final). Ex: `https://app.clientize.test` |
| `CLIENTIZE_CLIENT_SECRET` | Client Secret do app, obtido no portal de parceiros |
| `CLIENTIZE_SIGNING_SECRET` | Signing Secret usado para verificar assinaturas HMAC dos webhooks |

## Licenca

[MIT](LICENSE)

---

Documentacao completa: [https://docs.clientize.com.br](https://docs.clientize.com.br)
