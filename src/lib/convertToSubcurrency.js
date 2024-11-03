function convertToSubcurrency(prices, factor = 100) {
  return Math.round(prices * factor);
}

export default convertToSubcurrency;
