import { useState, useEffect } from "react";

const CURRENCY_API = "https://open.er-api.com/v6/latest/INR";

export function useCurrencyRates() {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(CURRENCY_API)
      .then((r) => r.json())
      .then((data) => {
        if (data.result === "success") setRates(data.rates);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { rates, loading };
}

export function convertPrice(priceNum, rates) {
  if (!rates) return null;
  const currencies = ["USD", "EUR", "GBP"];
  return currencies.map((code) => {
    const amount = Math.round(priceNum * rates[code]);
    return { code, formatted: new Intl.NumberFormat("en-US", { style: "currency", currency: code, maximumFractionDigits: 0 }).format(amount) };
  });
}
