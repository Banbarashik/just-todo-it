import { component } from 'reefjs/src/reef';
import * as model from '../model';

class FiltersList {
  _parentElement = document.querySelector('.filters-list');

  constructor() {
    component(this._parentElement, this._template);
  }

  _template() {
    const { inbox, today, activeProject } = model.state;

    return `
      <li class="${activeProject.id === inbox.id ? 'active' : ''}
      filter-inbox project-item">
        <a href="#${inbox.id}" class="project-item--link">
          <span>${inbox.title}</span>
        </a>
      </li>
      <li class="${activeProject.id === today.id ? 'active' : ''}
      filter-today project-item">
        <a href="#${today.id}" class="project-item--link">
          <span>${today.title}</span>
        </a>
      </li>
    `;
  }
}

new FiltersList();
