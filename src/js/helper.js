const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const cap1stLtr = str => str.replace(/^\w/, c => c.toUpperCase());

export const isToday = date =>
  date.toDateString() === new Date().toDateString();

export const formatDate = date => {
  const now = new Date();

  const monthIndex = date.getMonth();

  const dayOfMonth = date.getDate();
  const month = months[monthIndex];
  const year = date.getFullYear();
  const time =
    `${date.getHours()}`.padStart(2, 0) +
    ':' +
    `${date.getMinutes()}`.padStart(2, 0);

  if (year === now.getFullYear() && monthIndex === now.getMonth()) {
    if (dayOfMonth === now.getDate() - 1) return 'Yesterday';
    if (dayOfMonth === now.getDate()) return 'Today';
    if (dayOfMonth === now.getDate() + 1) return 'Tomorrow';
  }

  return `${dayOfMonth} ${month} ${year !== now.getFullYear() ? year : ''} ${
    time ? time : ''
  }`;
};
