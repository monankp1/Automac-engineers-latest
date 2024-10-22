export const calculatePercentageRange = (low, high) => {
  return {
    "0%": low,
    "25%": low + (high - low) * 0.25,
    "50%": low + (high - low) * 0.5,
    "75%": low + (high - low) * 0.75,
    "100%": high,
  };
};
