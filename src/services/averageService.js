function computeAverage(quotes) {
  // quotes: [{ buy_price, sell_price, source }]
  const valid = quotes.filter(q => q && q.buy_price != null && q.sell_price != null);
  if (valid.length === 0) return { average_buy_price: null, average_sell_price: null };
  const sumBuy = valid.reduce((s, q) => s + q.buy_price, 0);
  const sumSell = valid.reduce((s, q) => s + q.sell_price, 0);
  const avgBuy = sumBuy / valid.length;
  const avgSell = sumSell / valid.length;
  return {
    average_buy_price: Number(avgBuy),
    average_sell_price: Number(avgSell)
  };
}

function computeSlippage(quotes, average) {

  const avgBuy = average.average_buy_price;
  const avgSell = average.average_sell_price;
  return quotes.map(q => {
    const buy_slip = (q.buy_price == null || avgBuy == null) ? null : (q.buy_price - avgBuy) / avgBuy;
    const sell_slip = (q.sell_price == null || avgSell == null) ? null : (q.sell_price - avgSell) / avgSell;
    return {
      source: q.source,
      buy_price: q.buy_price,
      sell_price: q.sell_price,
      buy_price_slippage: buy_slip != null ? Number(buy_slip) : null,
      sell_price_slippage: sell_slip != null ? Number(sell_slip) : null
    };
  });
}

module.exports = { computeAverage, computeSlippage };
