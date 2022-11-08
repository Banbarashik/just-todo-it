import { component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';

class ProjectList {
  _parentElement = document.querySelector('.projects-list');

  constructor() {
    component(this._parentElement, this._template);
  }

  _template() {
    return model.state.projects
      .slice(1)
      .map(function (project) {
        return `
          <li data-id="${
            project.id
          }" class="project-item ${project.id === model.state.activeProject.id ? 'active' : ''}">
            <a href="#${project.id}" class="project-item--link">
              <span>${project.title}</span>
            </a>
            <button class="btn--project-controls">
            <svg width="15" height="3">
              <path d="M1.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0
              1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor" fill-rule="evenodd"></path>
            </svg>
          </button>
          </li>
        `;
      })
      .join('');
  }
}

new ProjectList();
