import React, { useState, useEffect } from "react";

// ...currencyMap and getFlagUrl functions as before...
const currencyMap = [
  { code: "USD", symbol: "$", name: "US Dollar", country: "US" },
  { code: "EUR", symbol: "€", name: "Euro", country: "EU" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", country: "IN" },
  { code: "GBP", symbol: "£", name: "British Pound", country: "GB" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", country: "JP" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", country: "AU" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", country: "CA" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", country: "CN" },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc", country: "CH" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble", country: "RU" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", country: "SG" },
  { code: "ZAR", symbol: "R", name: "South African Rand", country: "ZA" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", country: "NZ" },
  { code: "KRW", symbol: "₩", name: "South Korean Won", country: "KR" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", country: "BR" },
  { code: "MXN", symbol: "$", name: "Mexican Peso", country: "MX" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", country: "SE" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", country: "NO" },
  { code: "DKK", symbol: "kr", name: "Danish Krone", country: "DK" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty", country: "PL" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", country: "TR" },
  { code: "THB", symbol: "฿", name: "Thai Baht", country: "TH" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", country: "ID" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", country: "MY" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", country: "PH" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna", country: "CZ" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint", country: "HU" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", country: "SA" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", country: "AE" }
];
const getFlagUrl = (countryCode) =>
  countryCode === "EU"
    ? "https://flagcdn.com/24x18/eu.png"
    : `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;

const HISTORY_KEY = "conversion_history_v1";

const CurrencyDropdown = ({
  label,
  value,
  onChange,
  currencyList,
  showFlag = true
}) => {
  const [search, setSearch] = useState("");

  // Filter currencies based on search
  const filtered = currencyList.filter(
    (cur) =>
      cur.code.toLowerCase().includes(search.trim().toLowerCase()) ||
      cur.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div style={{ width: "100%" }}>
      <label style={{ fontWeight: 600, fontSize: 15, color: "#444" }}>{label}</label>
      <input
        type="text"
        placeholder="Search currency"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: "100%",
          marginTop: 5,
          marginBottom: 5,
          padding: "8px 12px",
          borderRadius: 8,
          border: "1.5px solid #b6b6d6",
          fontSize: 15,
          outline: "none",
          transition: "border 0.2s",
          background: "#f7faff"
        }}
      />
      <div style={{
        maxHeight: 146,
        overflowY: "auto",
        border: "1.5px solid #b6b6d6",
        borderRadius: 8,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(170,180,255,0.10)",
        marginBottom: 8,
      }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 8, color: "#888", fontSize: 14 }}>No results</div>
        ) : (
          filtered.map(cur => (
            <div
              key={cur.code}
              onClick={() => {onChange(cur.code); setSearch("");}}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "7px 12px",
                cursor: "pointer",
                background: cur.code === value ? "#e0edff" : "#fff",
                transition: "background 0.1s"
              }}
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  onChange(cur.code);
                  setSearch("");
                }
              }}
            >
              {showFlag && (
                <img src={getFlagUrl(cur.country)} alt={cur.code} width={20} height={14} style={{ borderRadius: 2, marginRight: 10, border: "1px solid #eee" }} />
              )}
              <span style={{ fontWeight: 600, minWidth: 42 }}>{cur.code}</span>
              <span style={{ marginLeft: 7, flex: 1, color: "#444" }}>{cur.name}</span>
              <span style={{ marginLeft: 8, color: "#555" }}>{cur.symbol}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const CurrencyConverter = () => {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [amount, setAmount] = useState(2);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  // Save history to localStorage on change
  useEffect(() => {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const fromCurrency = currencyMap.find(cur => cur.code === from);
  const toCurrency = currencyMap.find(cur => cur.code === to);

  const handleConvert = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setResult("Enter a valid amount");
      return;
    }
    setLoading(true);
    setResult(""); // Reset before conversion
    const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}&access_key=0396dbe25c0ca1185eb4665369ac82ab`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.result !== undefined && data.result !== null) {
        setResult(data.result);
        // Save to history
        const record = {
          from,
          to,
          fromCountry: fromCurrency.country,
          toCountry: toCurrency.country,
          fromSymbol: fromCurrency.symbol,
          toSymbol: toCurrency.symbol,
          amount,
          result: data.result,
          date: new Date().toISOString()
        };
        setHistory(h => [record, ...h].slice(0, 10)); // keep latest 10
      } else {
        setResult("Conversion error");
      }
    } catch {
      setResult("Error!");
    }
    setLoading(false);
  };

  const clearHistory = () => {
    setHistory([]);
    window.localStorage.removeItem(HISTORY_KEY);
  };

  // Responsive styling
  const wrapperStyle = {
    fontFamily: "Inter,Roboto,Arial,sans-serif",
    maxWidth: 420,
    margin: "40px auto",
    padding: "26px 18px",
    borderRadius: 18,
    background: "linear-gradient(135deg, #f7fbff 0%, #e3e7ff 100%)",
    boxShadow: "0 6px 36px 0 rgba(90,106,205,0.15)",
    border: "1px solid #e4eaff"
  };
  const h2Style = {
    textAlign: "center",
    marginBottom: 28,
    letterSpacing: 1,
    color: "#31408b",
    fontSize: 28,
    fontWeight: 800
  };

  return (
    <div style={wrapperStyle}>
      <h2 style={h2Style}>Currency Converter</h2>
      <div style={{ display: "flex", gap: 18, marginBottom: 16, flexWrap: "wrap" }}>
        <CurrencyDropdown
          label="From:"
          value={from}
          onChange={setFrom}
          currencyList={currencyMap}
        />
        <CurrencyDropdown
          label="To:"
          value={to}
          onChange={setTo}
          currencyList={currencyMap}
        />
      </div>

      {/* Show selected flags and codes above/below dropdowns for visual cue */}
      <div style={{
        display: "flex",
        gap: 16,
        marginBottom: 18,
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={getFlagUrl(fromCurrency.country)}
               alt={from}
               width={28} height={20}
               style={{ borderRadius: 4, border: "1.5px solid #e0e8ff" }}
          />
          <span style={{ fontWeight: 700, fontSize: 18, color: "#31408b" }}>{from}</span>
        </div>
        <span style={{
          fontSize: 23,
          fontWeight: 500,
          color: "#babdff"
        }}>⇄</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src={getFlagUrl(toCurrency.country)}
               alt={to}
               width={28} height={20}
               style={{ borderRadius: 4, border: "1.5px solid #e0e8ff" }}
          />
          <span style={{ fontWeight: 700, fontSize: 18, color: "#31408b" }}>{to}</span>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ fontWeight: 600, fontSize: 15, color: "#444" }}>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="1"
          style={{
            width: "100%",
            padding: "10px 14px",
            marginTop: 5,
            borderRadius: 8,
            border: "1.5px solid #b6b6d6",
            fontSize: 18,
            outline: "none",
            transition: "border 0.2s",
            background: "#f7faff"
          }}
          onFocus={e => e.target.style.borderColor="#889aff"}
          onBlur={e => e.target.style.borderColor="#b6b6d6"}
        />
      </div>
      <button
        onClick={handleConvert}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px 0",
          background: loading ? "#c1c7e9" : "linear-gradient(90deg,#4e7bfa 10%,#7b96fd 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: 1,
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: 14,
          outline: "none",
          boxShadow: loading ? "none" : "0 2px 8px rgba(90,106,205,0.08)",
          transition: "background 0.2s, box-shadow 0.2s"
        }}
      >
        {loading ? (
          <span>
            <span className="spinner" style={{
              width: 16, height: 16, border: "2.5px solid #fff",
              borderTop: "2.5px solid #90a0e8", borderRadius: "50%",
              display: "inline-block", marginRight: 8,
              animation: "spin 0.9s linear infinite", verticalAlign: "middle"
            }} /> Converting...
          </span>
        ) : "Convert"}
      </button>
      <div style={{
        marginTop: 18,
        textAlign: "center"
      }}>
        <span style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#556"
        }}>Result:</span>
        <span style={{
          display: "inline-block",
          marginLeft: 14,
          fontSize: 23,
          fontWeight: 800,
          color: "#3c4aa3",
          background: "#f0f3ff",
          padding: "8px 24px",
          borderRadius: 14,
          minWidth: 60,
          letterSpacing: 1,
          boxShadow: "0 1px 6px rgba(90,106,205,0.05)"
        }}>
          {loading
            ? "..."
            : (typeof result === "number" && toCurrency
                ? (<span style={{display: "inline-flex", alignItems: "center", gap: 8}}>
                    <img
                      src={getFlagUrl(toCurrency.country)}
                      alt={toCurrency.code}
                      width={22}
                      height={15}
                      style={{ borderRadius: 3, border: "1px solid #e0e0e0", marginRight: 6, verticalAlign: "middle" }}
                    />
                    <span>{toCurrency.symbol}{result}</span>
                  </span>)
                : result)}
        </span>
      </div>

      {/* Conversion History */}
      <div style={{
        marginTop: 38,
        background: "#fff",
        borderRadius: 13,
        padding: 14,
        boxShadow: "0 1px 8px rgba(90,106,205,0.06)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10
        }}>
          <span style={{
            fontSize: 17,
            fontWeight: 800,
            color: "#4e7bfa",
            letterSpacing: 1
          }}>Conversion History</span>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              style={{
                background: "transparent",
                color: "#4e7bfa",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14
              }}
              title="Clear history"
            >Clear</button>
          )}
        </div>
        {history.length === 0 ? (
          <div style={{ color: "#888", fontSize: 15, textAlign: "center" }}>No history yet.</div>
        ) : (
          <ul style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            maxHeight: 230,
            overflowY: "auto"
          }}>
            {history.map((h, idx) => (
              <li key={idx} style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontSize: 16,
                borderBottom: (idx !== history.length - 1) ? "1px solid #f0f0f0" : "none",
                padding: "8px 0",
                background: idx % 2 === 0 ? "#f7faff" : "#fff"
              }}>
                <img src={getFlagUrl(h.fromCountry)} alt={h.from} width={18} height={13} style={{ borderRadius: 2, border: "1px solid #eee" }} />
                <span style={{ fontWeight: 500, color: "#31408b" }}>{h.fromSymbol}{h.amount}</span>
                <span style={{ color: "#888", fontSize: 13 }}>
                  {h.from} → {h.to}
                </span>
                <img src={getFlagUrl(h.toCountry)} alt={h.to} width={18} height={13} style={{ borderRadius: 2, border: "1px solid #eee" }} />
                <span style={{ fontWeight: 700, color: "#4e7bfa" }}>
                  {h.toSymbol}{h.result}
                </span>
                <span style={{
                  color: "#aaa",
                  marginLeft: "auto",
                  fontSize: 11
                }}>
                  {new Date(h.date).toLocaleString([], { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Spinner animation keyframes */}
      <style>
        {`
          @keyframes spin { 100% { transform: rotate(360deg); } }
          @media (max-width: 600px) {
            div[style*="max-width: 420px"] { max-width: 99vw !important; padding: 12px 2vw !important; }
            h2 { font-size: 19px !important; }
            .resultBox { font-size: 15px !important; }
          }
        `}
      </style>
    </div>
  );
};

export default CurrencyConverter;