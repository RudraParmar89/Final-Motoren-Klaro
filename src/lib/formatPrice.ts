export const formatPrice = (price: number) => {
  if (typeof price !== 'number' || Number.isNaN(price)) return '₹0';
  // Use Indian-style abbreviations: Crore (Cr), Lakh (L)
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} L`;
  } else {
    // toLocaleString will respect grouping for en-IN if available
    try {
      return `₹${price.toLocaleString('en-IN')}`;
    } catch (err) {
      return `₹${price.toLocaleString()}`;
    }
  }
};

export default formatPrice;
