# BaseChainLore — MVP Frontend

Living on-chain story on Base Sepolia. Anyone adds one sentence.

## Setup on Replit

### 1. Install dependencies
```bash
npm install
```

### 2. Get a free WalletConnect Project ID
- Go to https://cloud.walletconnect.com
- Create a free account → New Project
- Copy your Project ID

### 3. Add it to `lib/wagmi.ts`
Replace `YOUR_WALLETCONNECT_PROJECT_ID` with your actual ID.

### 4. Run
```bash
npm run dev
```

App runs at `http://localhost:3000` (or your Replit URL).

---

## Contract
- **Address:** `0x3aF69540d1f63d916B5A4bcb4aADf7880737EF94`
- **Network:** Base Sepolia (chain ID: 84532)
- **Explorer:** https://sepolia.basescan.org

## Get Base Sepolia ETH
- https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- https://faucet.quicknode.com/base/sepolia

## File Structure
```
pages/
  _app.tsx       — wagmi + rainbowkit providers
  index.tsx      — main page
components/
  StoryFeed.tsx  — reads + displays story lines (paginated)
  AddLine.tsx    — write tx to add a line
  StartStory.tsx — write tx to start a new story
lib/
  wagmi.ts       — chain config
  contract.ts    — ABI + contract address
styles/
  globals.css    — terminal/CRT aesthetic
```
