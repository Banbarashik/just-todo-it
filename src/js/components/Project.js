import { component } from '../../../node_modules/reefjs/src/reef';
import { formatDate } from '../helper';
import * as model from '../model';

class Project {
  _parentElement = document.querySelector('.project-window');

  constructor() {
    this._addHandlerMakeProjectActive();
    this._addHandlerSort();

    component(this._parentElement, this._template.bind(this));
  }

  _template() {
    const project = model.state.activeProject;

    if (!Object.keys(project).length) return '';

    return `
      <div class="project" data-id="${project.id}">
        <h1 class="project__title">${project.title}</h1>

        <button class="sort--by-due-date">Sort by due date</button>

        <div class="project__details">
          ${
            project.description
              ? `<div class="project__description"><p>Description:</p><p>${project.description}</div>`
              : ''
          }
            ${
              project.dueDate?.date
                ? `<div class="project__due-date"><p>Due date:</p><p>${formatDate(
                    project.dueDate.date,
                    project.dueDate.time
                  )}</div>`
                : ''
            }
        </div>
        <ul class="tasks">
          ${this._generateTasksMarkup(project.tasks)}
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
              task.dueDate?.date
                ? `<p class="task__due-date">${formatDate(
                    task.dueDate.date,
                    task.dueDate.time
                  )}</p>`
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
    ['hashchange', 'load'].forEach(ev =>
      window.addEventListener(ev, function () {
        const id = window.location.hash.slice(1);
        if (!id) return;
        else if (id === 'today') model.setTodayTasks();

        model.setProjectAsActive(id);
      })
    );
  }

  _addHandlerSort() {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.sort--by-due-date');
      if (!btn) return;

      model.sortByDueDate();
    });
  }
}

export default new Project();
