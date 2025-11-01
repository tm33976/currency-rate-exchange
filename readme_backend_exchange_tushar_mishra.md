# 💱 Backend Exchange API

**Author:** Tushar Mishra  
**Email:** tm3390782@gmail.com

A simple and educational Node.js backend that scrapes live **USD exchange rates** (to ARS and BRL), stores them in a local database, and exposes clean API endpoints for developers or analysts to fetch, analyze, and compare rates.

This project demonstrates real-world backend design, web scraping, data aggregation, and API design principles — perfect for beginners to learn from and professionals to extend.

---

## 🚀 What This Project Does

**Backend Exchange API** continuously collects currency exchange rates from multiple public financial websites and provides:

- ✅ **Real-time quotes** from several trusted sources  
- ✅ **Average computation** across sources  
- ✅ **Slippage calculation** to detect outliers  
- ✅ **Automatic refresh every 55 seconds**  
- ✅ **Persistent storage using SQLite**

---

## 🧠 Tech Stack

| Layer | Technology |
|--------|-------------|
| Language | Node.js (v18+) |
| Framework | Express.js |
| Database | SQLite3 |
| Scraping | Axios + Cheerio + Puppeteer |
| Deployment | Render / Railway / Docker |

---

## 📦 Project Structure

```
backend-exchange/
├── src/
│   ├── index.js              # Entry point (Express app)
│   ├── scrapers/             # Individual site scrapers
│   ├── services/             # Logic for averaging/slippage
│   ├── db.js                 # SQLite database connection
│   └── config.js             # Config (polling, sources, etc.)
├── data/quotes.db            # SQLite database file
├── package.json              # Dependencies & setup
└── README.md                 # Documentation (this file)
```

---

## ⚙️ How It Works

1. **Scraping Layer:** Fetches exchange rates (buy/sell) from:
   - [Ámbito](https://www.ambito.com)
   - [Cronista](https://www.cronista.com)
   - [DólarHoy](https://www.dolarhoy.com)
   - [Wise](https://wise.com)
   - [Nubank](https://nubank.com.br)
   - [Nomad](https://www.nomadglobal.com)

2. **Database Layer:** Stores every fetched quote in `data/quotes.db`.
3. **Service Layer:** Calculates averages and slippages.
4. **API Layer:** Provides endpoints to access formatted JSON data.

---

## 🔥 Endpoints Overview

### 1️⃣ Get Latest Quotes
```
GET /quotes?currency=ARS
GET /quotes?currency=BRL
```
**Response:**
```json
[
  {
    "source": "https://www.cronista.com/...",
    "buy_price": 1430,
    "sell_price": 1450,
    "currency": "ARS",
    "fetched_at": 1761933432115
  }
]
```

### 2️⃣ Get Average Prices
```
GET /average?currency=ARS
```
**Response:**
```json
{
  "average_buy_price": 953.7,
  "average_sell_price": 967.4
}
```

### 3️⃣ Get Slippage (Deviation per Source)
```
GET /slippage?currency=ARS
```
**Response:**
```json
[
  {
    "source": "https://www.cronista.com/...",
    "buy_price": 1430,
    "sell_price": 1450,
    "buy_price_slippage": 0.49,
    "sell_price_slippage": 0.50
  }
]
```

---

## 🧰 Local Setup (Step-by-Step)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/backend-exchange.git
cd backend-exchange

# 2. Install dependencies
npm install

# 3. Run in development mode
npm run dev

# 4. Access locally
http://localhost:3000/quotes?currency=ARS
```

💡 **Tip:** The database auto-creates in `data/quotes.db` and fills every 55 seconds.

---

## 🧾 Example Output (Formatted JSON)
```json
[
  {
    "source": "https://www.dolarhoy.com",
    "buy_price": 1430,
    "sell_price": 1450,
    "currency": "ARS",
    "fetched_at": 1761933432115
  }
]
```

---

## 🗃️ Database

- File path: `data/quotes.db`
- Table: `quotes`

```sql
CREATE TABLE quotes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  source TEXT,
  currency TEXT,
  buy_price REAL,
  sell_price REAL,
  fetched_at INTEGER
);
```

Inspect the DB with:
```bash
cd data
sqlite3 quotes.db
.tables
SELECT * FROM quotes LIMIT 10;
```

---



## 🌍 Deployment (Render)
1. Push code to GitHub.
2. Create a new **Web Service** on [Render.com](https://render.com).
3. Build command: `npm install`  
   Start command: `npm start`
4. Done — your API will be live at `https://your-app.onrender.com` 🎉

---

## 🧮 Future Enhancements

- 📈 Add `/history` endpoint for trend data.
- ⚠️ Add rate alert system for abnormal slippage.
- 🧮 Auto-detect outliers & ignore them in averages.
- 📊 React dashboard to visualize live FX data.

---

## 🧑‍💻 Contributing
Pull requests welcome! If you find a bug or want to suggest improvements:
1. Fork the repo
2. Create a new branch (`feature/new-idea`)
3. Submit a PR 🚀

---


**Contact:**  
📧 tm3390782@gmail.com  
👨‍💻 [GitHub Profile](https://github.com/tm33976)

> Built by Tushar Mishra — for learners, developers, and innovators exploring backend APIs and data aggregation.

