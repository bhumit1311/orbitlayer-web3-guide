const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const priceGrid = document.querySelector("#priceGrid");
const priceStatus = document.querySelector("#priceStatus");
const refreshPrices = document.querySelector("#refreshPrices");

const coinLabels = {
  bitcoin: { name: "Bitcoin", symbol: "BTC" },
  ethereum: { name: "Ethereum", symbol: "ETH" },
};

async function loadPrices() {
  if (!priceGrid || !priceStatus) return;

  priceStatus.textContent = "Loading latest prices...";
  refreshPrices?.setAttribute("disabled", "true");

  try {
    const endpoint = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd&include_24hr_change=true";
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("CoinGecko request failed");
    const data = await response.json();
    renderPrices(data);
    priceStatus.textContent = `Updated ${new Date().toLocaleTimeString()}`;
  } catch (error) {
    priceStatus.textContent = "Could not load live prices. Please refresh again in a moment.";
    priceGrid.innerHTML = "";
  } finally {
    refreshPrices?.removeAttribute("disabled");
  }
}

function renderPrices(data) {
  priceGrid.innerHTML = Object.entries(coinLabels)
    .map(([id, coin]) => {
      const price = data[id]?.usd ?? 0;
      const change = data[id]?.usd_24h_change ?? 0;
      const direction = change >= 0 ? "up" : "down";
      const arrow = change >= 0 ? "▲" : "▼";

      return `
        <article class="price-card">
          <div class="price-head">
            <div>
              <h2>${coin.name}</h2>
              <p>${coin.symbol}</p>
            </div>
            <span class="coin-symbol">${coin.symbol.charAt(0)}</span>
          </div>
          <div class="price">$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          <span class="change ${direction}">${arrow} ${Math.abs(change).toFixed(2)}% in 24h</span>
        </article>
      `;
    })
    .join("");
}

refreshPrices?.addEventListener("click", loadPrices);
loadPrices();

const simulator = document.querySelector(".simulator-grid");

function fakeHash(input) {
  let h1 = 0x811c9dc5;
  let h2 = 0x45d9f3b;

  for (let i = 0; i < input.length; i += 1) {
    const code = input.charCodeAt(i);
    h1 ^= code;
    h1 = Math.imul(h1, 16777619);
    h2 ^= code + i;
    h2 = Math.imul(h2, 1597334677);
  }

  const parts = [];
  for (let i = 0; i < 8; i += 1) {
    h1 = Math.imul(h1 ^ (h1 >>> 13), 1274126177);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    parts.push(((h1 ^ h2) >>> 0).toString(16).padStart(8, "0"));
  }

  return parts.join("");
}

function getBlock(number) {
  return {
    data: document.querySelector(`#block${number}Data`),
    prev: document.querySelector(`#block${number}Prev`),
    nonce: document.querySelector(`#block${number}Nonce`),
    hash: document.querySelector(`#block${number}Hash`),
    status: document.querySelector(`#block${number}Status`),
  };
}

function calculateBlockHash(block) {
  return fakeHash(`${block.prev.value}|${block.data.value}|${block.nonce.value}`);
}

function setBlockStatus(block, isValid) {
  block.status.textContent = isValid ? "Valid" : "Invalid";
  block.status.classList.toggle("valid", isValid);
  block.status.classList.toggle("invalid", !isValid);
}

function refreshSimulator() {
  if (!simulator) return;

  const block1 = getBlock(1);
  const block2 = getBlock(2);
  const hash1 = calculateBlockHash(block1);

  block1.hash.textContent = hash1;
  block2.prev.value = hash1;

  const hash2 = calculateBlockHash(block2);
  block2.hash.textContent = hash2;

  const block1Valid = hash1.startsWith("00");
  setBlockStatus(block1, block1Valid);
  setBlockStatus(block2, block1Valid && hash2.startsWith("00") && block2.prev.value === hash1);
}

function mineBlock(number) {
  const block = getBlock(number);
  let nonce = Number(block.nonce.value) || 0;
  let hash = calculateBlockHash(block);

  while (!hash.startsWith("00")) {
    nonce += 1;
    block.nonce.value = nonce;
    hash = calculateBlockHash(block);
  }

  refreshSimulator();
}

if (simulator) {
  simulator.addEventListener("input", refreshSimulator);
  simulator.addEventListener("click", (event) => {
    const button = event.target.closest(".mine-button");
    if (!button) return;
    mineBlock(button.dataset.block);
  });
  refreshSimulator();
}
