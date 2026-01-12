"use client";

import { useEffect, useRef, memo } from "react";

interface TradingViewWidgetProps {
  symbol?: string;
  theme?: "light" | "dark";
  height?: number;
}

function TradingViewWidget({
  symbol = "BINANCE:ETHUSDT",
  theme = "dark",
  height = 400,
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "15",
      timezone: "Etc/UTC",
      theme: theme,
      style: "1",
      locale: "en",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
      container_id: "tradingview_widget",
    });

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      scriptLoaded.current = false;
    };
  }, [symbol, theme]);

  return (
    <div
      className="tradingview-widget-container"
      style={{ height: `${height}px`, width: "100%" }}
    >
      <div
        id="tradingview_widget"
        ref={containerRef}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}

export default memo(TradingViewWidget);
