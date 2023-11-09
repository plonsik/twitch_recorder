export const formatGameLength = (startDate: Date, endDate: Date) => {
  const diffInSeconds = (endDate.getTime() - startDate.getTime()) / 1000;
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);

  return `${hours}h ${minutes}m`;
};
