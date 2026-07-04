# 🎉 Central Food Park — Sistema de Reservas

Sistema de reservas para aniversários e eventos do Central Food Park.

## Backend (Supabase)

O app usa [Supabase](https://supabase.com) como banco de dados + autenticação (reservas e bloqueios de data são reais e persistentes; login de admin é uma conta de verdade, não uma senha fixa no código).

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor** do projeto, rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) — cria as tabelas `reservations` e `blocked_dates`, as políticas de segurança (RLS) e a view pública de disponibilidade.
3. Em **Authentication → Users → Add User**, crie sua conta de admin (e-mail + senha à sua escolha). Essa é a conta usada pra logar em **🔐 Admin** no app — ninguém além de você sabe essa senha.
4. Em **Project Settings → API**, copie a **Project URL** e a **anon public key**.
5. Copie `.env.example` para `.env` e preencha os dois valores:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```

## Como rodar

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

Pra deploy no Netlify, adicione as mesmas duas variáveis (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) em **Site configuration → Environment variables** no painel do Netlify.

## Acesso Administrativo

Na tela inicial, clique em **🔐 Admin** e entre com o e-mail e senha da conta criada no passo 3 acima.

## Funcionalidades

- 8 pacotes de reserva (gratuitos e pagos)
- Formulário de reserva com seleção de espaço
- Calendário com bloqueio de datas
- Painel administrativo com gestão de status
- Alerta automático de reservas em 2 dias
- Integração WhatsApp para confirmações
- Pagamento via PIX com política de cancelamento
- Galeria de espaços com fotos reais
- Login/senha para área administrativa

## Tecnologias

- React 18
- Vite 5
- CSS-in-JS (inline styles)

## Estrutura

```
src/
├── App.jsx        # Aplicação completa
└── main.jsx       # Entry point
public/
└── images/        # Fotos dos espaços
```

## Imagens

As fotos dos espaços estão em `/public/images/` com os nomes:
- space_s1.jpg — Lounge ao lado da Sinuca
- space_s2.jpg — Lounge frente ao Nikô Sushi
- space_s3.jpg — Mesas frente ao Palco (A)
- space_s4.jpg — Mesas frente ao Palco (B)
- space_s5.jpg — Mesa frente ao Lago (A)
- space_s6.jpg — Mesa frente ao Lago (B)
- space_s7.jpg — Deck do Lago
- space_s8.jpg — Deck lado Choperia
- space_s9.jpg — Mesa frente Bar/Choperia
- space_s10.jpg — Mesa frente ao Bar (A)
- space_s11.jpg — Mesa frente ao Bar (B)

## Deploy

### Vercel / Netlify
Faça upload da pasta do projeto. Build command: `npm run build`. Output: `dist/`.

### Replit
Importe o projeto e rode `npm install && npm run dev`.
