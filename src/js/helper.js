// prettier-ignore
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const mix = superclass => new MixinBuilder(superclass);

class MixinBuilder {
  constructor(superclass) {
    this.superclass = superclass;
  }

  with(...mixins) {
    return mixins.reduce((c, mixin) => mixin(c), this.superclass);
  }
}

export const cap1stLtr = str => str.replace(/^\w/, c => c.toUpperCase());

export function isToday(date) {
  // TODO: note that the date is a string, not a Date object
  // or make it work with a Date object instead
  const now = new Date(); // TODO: rename 'now' to 'today'
  const [year, monthIndex, dayOfMonth] = date.split('-').map(Number);

  return (
    year === now.getFullYear() &&
    monthIndex - 1 === now.getMonth() &&
    dayOfMonth === now.getDate()
  );
}

export function formatDate({ date, time } = {}) {
  if (!date) return;

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
}

export function agentSmithObj(smithObj, origObj) {
  Object.keys(smithObj).forEach(function (key) {
    if (smithObj[key] === origObj[key]) return;

    if (typeof smithObj[key] === 'object')
      agentSmithObj(smithObj[key], origObj[key]);

    origObj[key] = smithObj[key];
  });
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

export function changeHash(hash) {
  window.history.pushState(null, '', `#${hash}`);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}
