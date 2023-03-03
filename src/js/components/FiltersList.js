import { component } from 'reefjs/src/reef';
import * as model from '../model';

class FiltersList {
  _parentElement = document.querySelector('.filters-list');

  constructor() {
    component(this._parentElement, this._template);
  }

  _template() {
    return `
      <li class="filter-inbox project-item ${
        model.state.activeProject?.id === 'inbox' ? 'active' : ''
      }">
        <a href="#inbox" class="project-item--link"><span>Inbox</span></a>
      </li>
      <li class="filter-today project-item ${
        model.state.activeProject?.id === 'today' ? 'active' : ''
      }">
        <a href="#today" class="project-item--link"><span>Today</span></a>
      </li>
    `;
  }
}

new FiltersList();
