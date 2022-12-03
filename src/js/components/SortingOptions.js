import { component, store } from '../../../node_modules/reefjs/src/reef';

class SortingOptions {
  _parentElement = document.querySelector('.dropdown--sort-by');

  constructor(state) {
    this._addHandlerOpenSortOpts();

    this.state = state;

    component(this._parentElement, this._template.bind(this), {
      stores: ['sorting-options'],
    });
  }

  _template() {
    if (!this.state.areSortOptsOpened) return '';

    return `
      <div class="popper" style="top: ${this.state.y}px; left: ${this.state.x}px">
        <ul class="menu-list">
          <li class="menu-item active">
            <span>Due date</span>
            <div class="sorting-order-btns">
              <button class="btn--arrow btn--ascending">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="48"
                    d="M112 268l144 144 144-144M256 392V100"
                  />
                </svg>
              </button>
              <button class="btn--arrow btn--descending">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
                  <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="48"
                    d="M112 244l144-144 144 144M256 120v292"
                  />
                </svg>
              </button>
            </div>
          </li>
          <li class="menu-item">Default</li>
        </ul>
      </div>
    `;
  }

  _openSortOpts(e) {
    const btn = e.target.closest('.btn--sort-by');

    if (!btn) {
      this.state.areSortOptsOpened = false;
      return;
    }

    this.state.areSortOptsOpened = true;

    const rect = btn.getBoundingClientRect();
    this.state.y = rect.bottom;
    this.state.x = rect.left;
  }

  _addHandlerOpenSortOpts() {
    document.addEventListener('click', this._openSortOpts.bind(this));
  }
}

const state = store(
  {
    areSortOptsOpened: false,
    x: null,
    y: null,
  },
  'sorting-options'
);

export default new SortingOptions(state);
