import Sortable from 'sortablejs';
import { component } from '../../../node_modules/reefjs/src/reef';
import {
  formatDate,
  storeInLocalStorage,
  removeFromLocalStorage,
} from '../helper';
import * as model from '../model';

class Project {
  _parentElement = document.querySelector('.project-window');
  _sortable;

  constructor() {
    this._addHandlerMakeProjectActive();
    this._addHandlerMakeTasksListDND();
    this._addHandlerSubscribeToTaskEvents();

    component(this._parentElement, this._template.bind(this));
  }

  _template() {
    const project = model.state.activeProject;
    if (!Object.keys(project).length) return '';

    return `
      <div class="project" data-id="${project.id}">
        <div class="project__title-and-settings">
          <h1>${project.title}</h1>
          <ul class="project__settings-list">
            <li>
              <button class="project__settings-item btn--sort-by">Sorting method</button>
            </li>
          </ul>
        </div>
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
            <button class="btn--task-controls ${
              model.TaskControls.state.areControlsOpened &&
              model.TaskControls.state.task.id === task.id
                ? 'active'
                : ''
            }">
              <svg width="15" height="3">
                <path d="M1.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6
                0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1
                1 0-3 1.5 1.5 0 0 1 0 3z" fill="currentColor" fill-rule="evenodd"></path>
              </svg>
            </button>
            ${
              model.state.activeProject.id !== 'today'
                ? ''
                : `<a href="#${task.projectId}" class="task__project-title">${
                    [model.state.inbox, ...model.state.projects].find(
                      project => project.id === task.projectId
                    ).title
                  }</a>`
            }
          </li>
        `;
      })
      .join('');
  }

  _addHandlerMakeTasksListDND() {
    this._parentElement.addEventListener('reef:render', () => {
      const tasks = this._parentElement.querySelector('.tasks');
      // need this check because '_parentElement' can be empty if there's no active project
      if (!tasks) return;

      // check if there's already a sortable instance
      if (!this._sortable) {
        this._sortable = Sortable.create(tasks, {
          forceFallback: true,
          onStart(e) {
            e.from
              .querySelectorAll('.btn--task-controls')
              .forEach(btn => (btn.style.visibility = 'hidden'));

            document.documentElement.classList.add('dragging');
          },
          onEnd(e) {
            e.from
              .querySelectorAll('.btn--task-controls')
              .forEach(btn => (btn.style.visibility = ''));

            document.documentElement.classList.remove('dragging');
          },
          onUpdate() {
            model.setDefaultOrder(this.toArray());
            model.state.activeProject.sortingMethod.body();
          },
        });

        // Store tasks when the list is created (to prevent the 'defaultOrder' array
        // from being empty if there was no 'onUpdate' event before)
        model.setDefaultOrder(this._sortable.toArray());
      }

      // disable the sortable if true (= the project's sorting method isn't 'default')
      this._sortable.option(
        'disabled',
        model.state.activeProject.sortingMethod.name !== 'default'
      );

      // 'cursor: grab' when hovering a task if the sortable isn't disabled
      if (!this._sortable.options.disabled)
        this._sortable.el.classList.add('draggable');
    });
  }

  _addHandlerMakeProjectActive() {
    ['hashchange', 'load'].forEach(ev =>
      window.addEventListener(ev, () => {
        const id = window.location.hash.slice(1);
        if (!id) return;
        else if (id === 'today') model.setTodayTasks();
        model.setProjectAsActive(id);
      })
    );
  }

  _addHandlerSubscribeToTaskEvents() {
    ['add', 'edit', 'delete'].forEach(ev => {
      // quick and dirty solution :p
      document.addEventListener(ev + '-task', e => {
        e.detail.projects.forEach(project => {
          if (project) storeInLocalStorage(project.id, project);
        });

        const DOMIdTasksOrder =
          ev !== 'add'
            ? this._sortable.toArray()
            : this._sortable.toArray().concat(e.detail.task.projectId);

        model.setDefaultOrder(DOMIdTasksOrder);
        model.state.activeProject.sortingMethod.body();

        if (model.state.activeProject.id === 'today') model.setTodayTasks();
      });

      document.addEventListener(ev + '-project', e => {
        ev !== 'delete'
          ? storeInLocalStorage(e.detail.project.id, e.detail.project)
          : removeFromLocalStorage(e.detail.project.id);
      });
    });
  }
}

export default new Project();
