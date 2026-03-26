# Clientize Extension Demo

App de exemplo que demonstra como construir uma extensão para a plataforma Clientize.

<!-- ![Screenshot](screenshot.png) -->

## O que este app demonstra

- **Verificação de session token** — valida o token JWT da sessão do iframe via API da Clientize
- **Comunicação via App Bridge** — envia comandos `postMessage` para o host (toast, navigate)
- **Callback de instalação** — recebe e verifica o webhook POST enviado quando o app é instalado
- **Padrão de integração com a API** — proxy server-side para chamadas autenticadas à API da Clientize

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- Uma conta de parceiro na Clientize com acesso ao portal de parceiros
- Um workspace de teste para instalar o app

## Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/clientizebr/app-demo.git
cd app-demo
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

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
  index.js              Página principal — exibe o session token,
                        botão de verificação e controles do App Bridge
  callback.js           Página que exibe os dados do último callback
                        de instalação recebido
  api/
    callback.js         Endpoint que recebe o webhook POST de instalação
                        e verifica a assinatura HMAC
    verify-session.js   Proxy server-side que valida o session token
                        chamando a API da Clientize
.env.example            Modelo das variáveis de ambiente necessárias
next.config.js          Configuração do Next.js
package.json            Dependências e scripts
```

## Como funciona

### Callback de instalação

Quando um usuário instala seu app, a Clientize envia um `POST` para a URL de callback configurada. O payload contém os dados da instalação (workspace, usuário, escopos). O header `X-Clientize-Signature` permite verificar que a requisição realmente veio da Clientize usando HMAC-SHA256 com o Signing Secret.

```
Clientize --POST--> /api/callback --verifica HMAC--> armazena dados
```

### Session token (iframe)

Quando o app é aberto dentro da Clientize, ele carrega em um iframe com o parâmetro `?session_token=...`. Esse token JWT identifica o workspace e o usuário. O app envia o token para seu próprio backend (`/api/verify-session`), que faz uma chamada server-side para a API da Clientize validar o token.

```
iframe (?session_token=xxx) --> /api/verify-session --> Clientize API /api/v1/session/verify
```

### App Bridge (postMessage)

O app pode se comunicar com o host Clientize enviando mensagens via `window.parent.postMessage`. Comandos disponíveis:

| Tipo | Descrição |
|------|-----------|
| `clientize:toast` | Exibe uma notificação toast na interface do host |
| `clientize:navigate` | Navega para uma rota dentro da Clientize |

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `CLIENTIZE_URL` | URL base da Clientize (sem barra no final). Ex: `https://app.clientize.test` |
| `CLIENTIZE_CLIENT_SECRET` | Client Secret do app, obtido no portal de parceiros |
| `CLIENTIZE_SIGNING_SECRET` | Signing Secret usado para verificar assinaturas HMAC dos webhooks |

## Licença

[MIT](LICENSE)

---

Documentação completa: [https://docs.clientize.com.br](https://docs.clientize.com.br)
