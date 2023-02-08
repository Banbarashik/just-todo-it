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

export const agentSmithObj = (smithObj, origObj) => {
  Object.keys(smithObj).forEach(key => {
    if (smithObj[key] === origObj[key]) return;

    if (typeof smithObj[key] === 'object')
      agentSmithObj(smithObj[key], origObj[key]);

    origObj[key] = smithObj[key];
  });
};

export const mix = superclass => new MixinBuilder(superclass);

class MixinBuilder {
  constructor(superclass) {
    this.superclass = superclass;
  }

  with(...mixins) {
    return mixins.reduce((c, mixin) => mixin(c), this.superclass);
  }
}

export function emit(type, detail, elem = document) {
  // Create a new event
  let event = new CustomEvent(type, {
    cancelable: true,
    bubbles: true,
    detail: detail,
  });

  // Dispatch the event
  return elem.dispatchEvent(event);
}

export function storeInLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeFromLocalStorage(key) {
  localStorage.removeItem(key);
}

export function loadFromLocalStorage(key) {
  const str = localStorage.getItem(key);
  if (str) return JSON.parse(str);
}