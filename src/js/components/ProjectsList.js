import { component } from 'reefjs';
import * as model from '../model';

class ProjectList {
  _parentElement = document.querySelector('.projects-list');

  constructor() {
    component(this._parentElement, this._template);
  }

  _template() {
    return model.state.projects
      .map(function (project) {
        return `
          <li data-id="${project.id}" class="project-item">
            <a href="#${project.id}" class="project-item--link
            ${
              project.id === model.state.activeProject.id
                ? 'project-item--active'
                : ''
            }">
              <span>${project.title}</span>
            </a>
            <button class="btn--project-controls">...</button>
          </li>
        `;
      })
      .join('');
  }
}

new ProjectList();
