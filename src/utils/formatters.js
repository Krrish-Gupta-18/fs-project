export function formatTime(timestampStr) {
  if (!timestampStr) return '';
  return timestampStr;
}

export function truncateText(text, maxLength = 45) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getInitials(name) {
  if (!name) return 'CF';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
