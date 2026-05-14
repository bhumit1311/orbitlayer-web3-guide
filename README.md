# OrbitLayer: Arbitrum Web3 Guide

OrbitLayer is a four-page Web3 learning website built for the Arbitrum Builder Pods assignment. It explains Layer 2 scaling, compares important Web3 concepts, displays live crypto prices, and includes an interactive block mining simulator.

Built by **Bhumit**.

GitHub: https://github.com/bhumit1311

## Pages

- **Home / Landing**: Introduces Arbitrum and explains why Ethereum needs Layer 2 networks.
- **Concepts**: Shows visual comparison cards for Web2 vs Web3, Ethereum vs Bitcoin, public vs private keys, and blockchain vs traditional databases.
- **Live Prices**: Fetches live ETH and BTC prices from the CoinGecko API and shows 24-hour price movement.
- **Block Simulator**: Demonstrates hashes, nonces, mining, and chain immutability using plain JavaScript.

## How to Run

No build step is required.

1. Open the project folder.
2. Open `index.html` in a browser.
3. Use the navigation bar to move between all four pages.

For the best local experience, you can also run a simple local server:

```bash
python -m http.server 5173
```

Then visit `http://localhost:5173`.

## Known Improvements

- Replace the placeholder footer name and GitHub link with your own details.
- Add screenshots of all four pages before submitting on GitHub.
- Add more coins such as ARB, SOL, or MATIC to the live price dashboard.
