import { component, store } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';

class SortingOptions {
  _parentElement = document.querySelector('.dropdown--sort-by');

  constructor(state) {
    this._addHandlerOpenSortOpts();
    this._addHandlerSetSortingMethod();

    this.state = state;

    component(this._parentElement, this._template.bind(this), {
      stores: ['sorting-options'],
    });
  }

  _template() {
    if (!this.state.areSortOptsOpened) return '';

    const project = model.state.activeProject;

    return `
      <div class="popper" style="top: ${
        this.state.elementPosition.y
      }px; left: ${this.state.elementPosition.x}px">
        <ul class="menu-list">
          <li data-sorting-method-name="default" class="menu-item ${
              project.sortingMethod.name === 'default' ? 'active' : ''
            }">Default</li>
          <li data-sorting-method-name="dueDate" class="menu-item ${
            project.sortingMethod.name === 'dueDate' ? 'active' : ''
          }">
            <span>Due date</span>
            <div class="sorting-order-btns">
              <button data-sorting-order="ascending" class="btn--order ${
                project.sortingMethod.name === 'dueDate' &&
                project.sortingMethod.order === 'ascending'
                  ? 'active'
                  : ''
              }">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
                  <path
                    fill="none"
                    stroke="grey"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="48"
                    d="M112 268l144 144 144-144M256 392V100"
                  />
                </svg>
              </button>
              <button data-sorting-order="descending" class="btn--order ${
                project.sortingMethod.name === 'dueDate' &&
                project.sortingMethod.order === 'descending'
                  ? 'active'
                  : ''
              }">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512">
                  <path
                    fill="none"
                    stroke="grey"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="48"
                    d="M112 244l144-144 144 144M256 120v292"
                  />
                </svg>
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

    const rect = btn.getBoundingClientRect();
    this.state.elementPosition = {
      x: rect.left,
      y: rect.bottom,
    };
  }

  setSortingMethod(e) {
    const item = e?.target.closest('.menu-item');
    const btn = e?.target.closest('.btn--order');

    model.setSortingMethod(
      item?.dataset.sortingMethodName,
      btn?.dataset.sortingOrder
    );

    model.state.activeProject.sortingMethod.body();
  }

  _addHandlerOpenSortOpts() {
    document.addEventListener('click', this._openSortOpts.bind(this));
  }

  _addHandlerSetSortingMethod() {
    this._parentElement.addEventListener(
      'click',
      this.setSortingMethod.bind(this)
    );
  }
}

const state = store(
  {
    areSortOptsOpened: false,
    elementPosition: {
      x: null,
      y: null,
    },
  },
  'sorting-options'
);

export default new SortingOptions(state);
