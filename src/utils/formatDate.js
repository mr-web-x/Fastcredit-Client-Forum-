export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffHours < 24) {
    return `pred ${diffHours} ${diffHours === 1 ? "hodinou" : "hodinami"}`;
  }
  if (diffDays < 7) {
    return `pred ${diffDays} ${diffDays === 1 ? "dňom" : "dňami"}`;
  }

  return date.toLocaleDateString("sk-SK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCreatedDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("sk-SK", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
