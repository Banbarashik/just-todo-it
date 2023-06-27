// prettier-ignore
const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const todayISOStr = new Date().toISOString().split('T')[0];

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

export const generateID = () => Date.now().toString();

function isTheDate(daysFromTodayOffset, dateStr) {
  const today = new Date();

  const theDateTimestamp = new Date(
    today.setDate(today.getDate() + daysFromTodayOffset)
  ).setHours(0, 0, 0, 0);
  const dateTimestamp = new Date(dateStr).setHours(0, 0, 0, 0);

  return theDateTimestamp === dateTimestamp;
}

const isYesterday = dateStr => isTheDate(-1, dateStr);
export const isToday = dateStr => isTheDate(0, dateStr);
const isTomorrow = dateStr => isTheDate(1, dateStr);

export function formatDate(dateStr, time) {
  if (!dateStr) return;

  if (isYesterday(dateStr)) return `Yesterday ${time}`;
  if (isToday(dateStr)) return `Today ${time}`;
  if (isTomorrow(dateStr)) return `Tomorrow ${time}`;

  const currentYear = new Date().getFullYear();
  const [year, monthNum, dayOfMonth] = dateStr.split('-').map(Number);
  const monthName = monthNames[monthNum - 1];

  // prettier-ignore
  return `${dayOfMonth} ${monthName} ${year === currentYear ? '' : year} ${time}`;
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

export const importAll = requireFunction =>
  requireFunction.keys().map(key => requireFunction(key));

export const getRandomArrItem = arr => arr[(Math.random() * arr.length) | 0];

export const getNonGetterObjPropValues = obj =>
  Object.values(Object.getOwnPropertyDescriptors(obj))
    .filter(desc => desc.value)
    .map(desc => desc.value);
