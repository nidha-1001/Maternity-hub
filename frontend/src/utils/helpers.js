export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const getStatusBadgeClass = (status) => {
  switch ((status || "").toLowerCase()) {
    case "pending":
      return "badge-pending";
    case "accepted":
    case "approved":
    case "paid":
      return "badge-accepted";
    case "rejected":
    case "failed":
      return "badge-rejected";
    case "completed":
      return "badge-completed";
    default:
      return "badge-pending";
  }
};
