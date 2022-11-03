import { component } from 'reefjs';
import * as model from '../model';

class Project {
  _parentElement = document.querySelector('.project-window');

  constructor() {
    this._addHandlerMakeProjectActive();

    component(this._parentElement, this._template.bind(this));
  }

  _template() {
    if (!Object.keys(model.state.activeProject).length) return '';

    return `
      <div class="project" data-id="${model.state.activeProject.id}">
        <h1 class="project__title">${model.state.activeProject.title}</h1>
        <div class="project__details">
          <div class="project__description">
            <p>Description:</p>
            <p>${model.state.activeProject.description}</p>
          </div>
          <div class="project__due-date">
            <p>Due date:</p>
            <p>${
              model.state.activeProject.dueDate
                ? model.state.activeProject.dueDate
                : 'No due date'
            }</p>
          </div>
        </div>
        <ul class="tasks">
          ${this._generateTasksMarkup(model.state.activeProject.tasks)}
        </ul>
      </div>
    `;
  }

  _generateTasksMarkup(tasks) {
    return tasks
      .map(function (task) {
        return `
          <li class="task" data-id="${task.id}">
            <p class="task__title">${task.title}</p>
            <p class="task__description">${task.description}</p>
            ${
              task.dueDate
                ? `<p class="task__due-date">${task.dueDate}</p>`
                : ''
            }
            <button class="btn--task-controls">
              <svg width="15" height="3">
                <path d="M1.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6
                0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1
                1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor" fill-rule="evenodd"></path>
              </svg>
            </button>
          </li>
        `;
      })
      .join('');
  }

  _addHandlerMakeProjectActive() {
    ['hashchange', 'load'].forEach(e =>
      window.addEventListener(e, function () {
        const id = window.location.hash.slice(1);
        if (!id) return;
        model.setProjectAsActive(id);
      })
    );
  }
}

export default new Project();
