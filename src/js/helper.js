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

export const isToday = date => {
  const now = new Date();
  const [year, monthIndex, dayOfMonth] = date.split('-').map(Number);

  if (
    year === now.getFullYear() &&
    monthIndex - 1 === now.getMonth() &&
    dayOfMonth === now.getDate()
  )
    return true;
};

export const formatDate = (date, time) => {
  const now = new Date();

  const [year, monthIndex, dayOfMonth] = date.split('-').map(Number);
  const month = months[monthIndex - 1];

  if (year === now.getFullYear() && monthIndex - 1 === now.getMonth()) {
    if (dayOfMonth === now.getDate() - 1) return `Yesterday ${time}`;
    if (dayOfMonth === now.getDate()) return `Today ${time}`;
    if (dayOfMonth === now.getDate() + 1) return `Tomorrow ${time}`;
  }

  // prettier-ignore
  return `${dayOfMonth} ${month} ${year !== now.getFullYear() ? year : ''} ${time}`;
};
