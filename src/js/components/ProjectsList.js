import icons from '../../img/icons.svg';

import { component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';

class ProjectList {
  _parentElement = document.querySelector('.projects-list');

  constructor() {
    component(this._parentElement, this._template.bind(this), {
      stores: ['global'],
    });
  }

  _template() {
    return model.state.projects
      .map(function (project) {
        return `
          <li data-id="${
            project.id
          }" class="project-item ${project.id === model.state.activeProject?.id ? 'active' : ''}">
            <a href="#${project.id}" class="project-item--link">
              <span>${project.title}</span>
            </a>
            <button class="btn--project-controls ${
              model.ProjectControls.state.areControlsOpened &&
              model.ProjectControls.state.project.id === project.id
                ? 'active'
                : ''
            }">
            <svg><use href="${icons}#icon-controls"></use></svg>
          </button>
          </li>
        `;
      })
      .join('');
  }
}

new ProjectList();
