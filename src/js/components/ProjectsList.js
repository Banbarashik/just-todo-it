import { component } from 'reefjs';
import * as model from '../model';

function _template() {
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

component('.projects-list', _template);
