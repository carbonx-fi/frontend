# Vercel Deployment Guide

## Quick Deploy

### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (from frontend directory)
vercel

# For production
vercel --prod
```

### Option 2: Vercel Dashboard
1. Go to https://vercel.com/new
2. Import from GitHub: `carbonx-fi/frontend`
3. Configure environment variables (see below)
4. Deploy

## Environment Variables

Set these in Vercel Project Settings > Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | `cmj5xoxss01p7jo0cnwjk9ssw` | Production, Preview, Development |
| `NEXT_PUBLIC_CHAIN_ID` | `5003` | All |
| `NEXT_PUBLIC_RPC_URL` | `https://rpc.sepolia.mantle.xyz` | All |
| `NEXT_PUBLIC_BLOCK_EXPLORER` | `https://sepolia.mantlescan.xyz` | All |

## Post-Deploy Checklist

- [ ] All pages load without errors
- [ ] Wallet connection works (Privy)
- [ ] Can connect to Mantle Sepolia
- [ ] Contract interactions work
- [ ] /submit-project form works

## Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add custom domain (e.g., app.carbonx.xyz)
3. Configure DNS records as shown
