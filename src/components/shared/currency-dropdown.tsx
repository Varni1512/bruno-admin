import { useState } from "react";

const currencies = [
  { code: "INR", symbol: "₹" },
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "CAD", symbol: "CA$" },
];

export default function CurrencyDropdown({ selected, onChange } : any) {
  const [open, setOpen] = useState(false);

  const selectedCurrency = currencies.find((c) => c.code === selected);

  return (
    <div className="relative w-full flex-1 ">
                <label htmlFor="price">Currency</label>

      <div
        className="border border-pre w-full rounded-lg px-3 py-2  cursor-pointer select-none"
        onClick={() => setOpen((prev) => !prev)}
      >
        {selectedCurrency?.symbol} {selectedCurrency?.code}
      </div>

      {open && (
        <div className="absolute bottom-12 z-10 border border-pre rounded bg-[#19001c] shadow">
          {currencies.map((currency) => (
            <div
              key={currency.code}
              className="px-3 py-2 hover:bg-[#93093840] cursor-pointer whitespace-nowrap"
              onClick={() => {
                onChange(currency.code);
                setOpen(false);
              }}
            >
              {currency.symbol} {currency.code}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
