# 💱 Backend Exchange API

**Author:** Tushar Mishra  
**Email:** tm3390782@gmail.com  

A full-stack-ready backend that scrapes live **USD exchange rates** (to ARS and BRL), stores them in a SQLite database, and provides clean REST API endpoints for real-time financial data and analytics.  

This project demonstrates real-world backend design, scraping, data aggregation, and API best practices — ideal for developers and learners alike.  

---

## 🚀 Live API

**🌍 Base URL (Deployed on Render):**
```
https://currency-rate-exchange-1.onrender.com
```

**Test Endpoints:**

| Endpoint | Description | Example URL |
|-----------|--------------|--------------|
| `/health` | Health check | [🔗 View](https://currency-rate-exchange-1.onrender.com/health) |
| `/quotes/currency=ARS` | Get latest quotes (default: ARS) | [🔗 View](https://currency-rate-exchange-1.onrender.com/quotes?currency=ARS) |
| `/quotes?currency=BRL` | Get quotes for BRL | [🔗 View](https://currency-rate-exchange-1.onrender.com/quotes?currency=BRL) |
| `/average?currency=ARS` | Get average buy/sell price | [🔗 View](https://currency-rate-exchange-1.onrender.com/average?currency=ARS) |
| `/slippage?currency=ARS` | Get deviation from average | [🔗 View](https://currency-rate-exchange-1.onrender.com/slippage?currency=ARS) |

---

## 🧠 Tech Stack

| Layer | Technology |
|--------|-------------|
| Language | Node.js (v18+) |
| Framework | Express.js |
| Database | SQLite (via better-sqlite3) |
| Scraping | Axios + Cheerio + Puppeteer |
| Deployment | Render (Free Plan, persistent `/data` volume) |

---

## 📦 Project Structure

```
backend-exchange/
├── src/
│   ├── index.js              # Entry point (Express + Poller)
│   ├── scrapers/             # Individual scraping logic
│   ├── services/             # Business logic (averages, slippage)
│   ├── routes/               # Express route definitions
│   ├── db.js                 # SQLite database setup
│   └── config.js             # Config (intervals, sources, etc.)
├── data/                     # Contains SQLite data volume
├── package.json              # Dependencies & scripts
├── .env                      # Environment variables
└── README.md                 # Documentation
```

---

## ⚙️ How It Works

### 🧩 1. Scraping Layer
Fetches live data from multiple trusted sources:
- [Ámbito](https://www.ambito.com)
- [Cronista](https://www.cronista.com)
- [DólarHoy](https://www.dolarhoy.com)
- [Wise](https://wise.com)
- [Nubank](https://nubank.com.br)
- [Nomad Global](https://www.nomadglobal.com)

### 🧮 2. Database Layer
Stores each new quote with timestamp inside `data/quotes.db`.

### ⚖️ 3. Service Layer
Calculates:
- Average buy/sell prices  
- Slippage per source (how far from average)  

### 🌐 4. API Layer
Exposes structured JSON responses via REST endpoints.

---

## 🔥 Endpoints Overview

### 1️⃣ Latest Quotes
```
GET /quotes?currency=ARS
GET /quotes?currency=BRL
```
**Example Response:**
```json
[
  {
    "source": "https://www.dolarhoy.com",
    "buy_price": 1425,
    "sell_price": 1445,
    "currency": "ARS",
    "fetched_at": 1762023945811
  }
]
```

---

### 2️⃣ Average Prices
```
GET /average?currency=ARS
```
**Response:**
```json
{
  "average_buy_price": 1425,
  "average_sell_price": 1445
}
```

---

### 3️⃣ Slippage (Deviation per Source)
```
GET /slippage?currency=ARS
```
**Response:**
```json
[
  {
    "source": "https://www.dolarhoy.com",
    "buy_slippage": 0,
    "sell_slippage": 0
  }
]
```

---

## 🧰 Local Setup (Development)

```bash
# 1️⃣ Clone the repository
git clone https://github.com/tm33976/currency-rate-exchange.git
cd currency-rate-exchange

# 2️⃣ Install dependencies
npm install

# 3️⃣ Run the project locally
npm run dev

# 4️⃣ Test in browser
http://localhost:3000/quotes?currency=ARS
```

💡 **Tip:** The database (`data/quotes.db`) is created automatically and updated every 60 seconds.

---

## 🧾 Example Output

```json
[
  {
    "source": "https://wise.com/es/currency-converter/brl-to-usd-rate",
    "buy_price": 5.3763,
    "sell_price": 5.3763,
    "currency": "BRL",
    "fetched_at": 1762023367875
  }
]
```

---

## 🌍 Deployment on Render

### ⚙️ Environment Variables
| Key | Example Value | Description |
|-----|----------------|-------------|
| `PORT` | `3000` | App port |
| `SQLITE_FILE` | `/data/quotes.db` | Persistent DB path |
| `POLL_INTERVAL_MS` | `60000` | Poll interval (60 sec) |
| `NODE_ENV` | `production` | Runtime environment |

### ⚙️ Render Configuration (render.yaml)
```yaml
services:
  - type: web
    name: backend-exchange
    env: node
    plan: free
    buildCommand: "npm install"
    startCommand: "npm start"
    disk:
      name: data
      mountPath: /data
      sizeGB: 1
    envVars:
      - key: NODE_ENV
        value: production
      - key: POLL_INTERVAL_MS
        value: 60000
      - key: SQLITE_FILE
        value: /data/quotes.db
```

---

## 🤝 Contributing
Contributions welcome!  
1. Fork the repo  
2. Create a branch (`feature/new-idea`)  
3. Commit & open a PR 🚀  

---

**Contact:**  
📧 tm3390782@gmail.com  
👨‍💻 [GitHub: tm33976](https://github.com/tm33976)


