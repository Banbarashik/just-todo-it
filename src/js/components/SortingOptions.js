import icons from '../../img/icons.svg';

import { component, store } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';

class SortingOptions {
  _parentElement = document.querySelector('.dropdown--sort-by');

  constructor(state) {
    this._addHandlerOpenSortOpts(this._openSortOpts.bind(this));
    this._addHandlerSetSortingMethod(model.setSortingMethod);

    this.state = state;

    component(this._parentElement, this._template.bind(this), {
      stores: ['sorting-options'],
    });
  }

  _template() {
    if (!this.state.areSortOptsOpened) return '';

    const {
      activeProject,
      activeProject: { sortingMethod },
    } = model.state;

    return `
      <div class="popper"
      style="top: ${this.state.elCoords.y}px; left: ${this.state.elCoords.x}px">
        <ul class="menu-list">
          ${
            activeProject.id !== model.state.today.id
              ? `<li data-sorting-method-name="default" class="menu-item ${
                  sortingMethod.name === 'default' ? 'active' : ''
                }">Default</li>`
              : ''
          }
          <li data-sorting-method-name="dueDate" class="menu-item ${
            sortingMethod.name === 'dueDate' ? 'active' : ''
          }">
            <span>Due date</span>
            <div class="sorting-order-btns">
              <button data-sorting-order="ascending" class="btn--order ${
                sortingMethod.name === 'dueDate' &&
                sortingMethod.order === 'ascending'
                  ? 'active'
                  : ''
              }">
                <svg><use href="${icons}#icon-sort--ascending"></use></svg>
              </button>
              <button data-sorting-order="descending" class="btn--order ${
                sortingMethod.name === 'dueDate' &&
                sortingMethod.order === 'descending'
                  ? 'active'
                  : ''
              }">
                <svg><use href="${icons}#icon-sort--descending"></use></svg>
              </button>
            </div>
          </li>
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

    const { left: x, bottom: y } = btn.getBoundingClientRect();
    this.state.elCoords = { x, y };
  }

  _addHandlerOpenSortOpts(handler) {
    document.addEventListener('click', handler);
  }

  _addHandlerSetSortingMethod(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const item = e.target.closest('.menu-item');
      const btn = e.target.closest('.btn--order');

      handler(
        model.state.activeProject.id,
        item.dataset.sortingMethodName,
        btn?.dataset.sortingOrder
      );
    });
  }
}

const state = store(
  {
    areSortOptsOpened: false,
    elCoords: { x: null, y: null },
  },
  'sorting-options'
);

export default new SortingOptions(state);
