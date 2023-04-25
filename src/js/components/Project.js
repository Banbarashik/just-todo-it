import icons from '../../img/icons.svg';

import Sortable from 'sortablejs';
import { component } from '../../../node_modules/reefjs/src/reef';
import { formatDate, storeInLocalStorage, changeHash } from '../helper';
import * as model from '../model';

class Project {
  _parentElement = document.querySelector('.project-window');
  _sortable;

  constructor() {
    this._addHandlerMakeProjectActive();
    this._addHandlerMakeTasksListDND();

    component(this._parentElement, this._template.bind(this));
  }

  _template() {
    const project = model.state.activeProject;

    // TODO: fix displaying 'Project not found' on first page load
    if (!Object.keys(project).length)
      return '<p class="error">Project not found</p>';

    const displayDate = formatDate(
      project.dueDate.dateStr,
      project.dueDate.time
    );

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
              ? `<div class="project__description"><p>Description:</p><p>${project.description}</p></div>`
              : ''
          }
            ${
              displayDate
                ? `<div class="project__due-date"><p>Due date:</p><p>${displayDate}</p></div>`
                : ''
            }
        </div>
        <ul class="tasks">${this._generateTasksMarkup(project.tasks)}</ul>
      </div>
    `;
  }

  _generateTasksMarkup(tasks) {
    return tasks
      .map(function (task) {
        const displayDate = formatDate(task.dueDate.dateStr, task.dueDate.time);
        console.log(displayDate);

        return `
          <li class="task ${
            task.isCompleted ? 'completed' : ''
          }" data-id="${task.id}">
            <p class="task__title">${task.title}</p>
            <p class="task__description">${task.description}</p>
            ${displayDate ? `<p class="task__due-date">${displayDate}</p>` : ''}
            <button class="btn--task-controls ${
              model.TaskControls.state.areControlsOpened &&
              model.TaskControls.state.task.id === task.id
                ? 'active'
                : ''
            }">
            <svg><use href="${icons}#icon-controls"></use></svg>
            </button>
            ${
              model.state.activeProject.id !== model.state.today.id
                ? ''
                : `<a href="#${task.projectId}" class="task__project-title">${
                    model
                      .getProjectsWithOwnTasks()
                      .find(project => project.id === task.projectId).title
                  }</a>`
            }
          </li>
        `;
      })
      .join('');
  }

  _createSortableInstance() {
    const htmlEl = document.documentElement;
    const listOfTasks = this._parentElement.querySelector('.tasks'); // rename 'tasks' to 'tasks-list' or smth
    const controlBtns = listOfTasks.querySelectorAll('.btn--task-controls');

    function toggleClasses() {
      controlBtns.forEach(btn => btn.classList.toggle('hidden'));
      htmlEl.classList.toggle('dragging');
    }

    this._sortable = Sortable.create(listOfTasks, {
      forceFallback: true,
      onStart: toggleClasses,
      onEnd: toggleClasses,
      onUpdate() {
        const { activeProject } = model.state;

        model.setDefaultOrder(activeProject, this.toArray());
        activeProject.sortingMethod.body();

        storeInLocalStorage(activeProject.id, activeProject);
      },
    });
  }

  _addHandlerMakeTasksListDND() {
    this._parentElement.addEventListener('reef:render', () => {
      const project = this._parentElement.querySelector('.project');

      // check whether the component has been rendered and thereof the list
      // of tasks is available to create a Sortable instance upon (or it will throw an err)
      if (!project) return;

      // check that there's no sortable instance yet (executes only once)
      if (!this._sortable) this._createSortableInstance();

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
    ['hashchange', 'load'].forEach(function (ev) {
      window.addEventListener(ev, function () {
        const id = window.location.hash.slice(1);
        if (!id) changeHash(model.state.today.id);
        else model.setProjectAsActive(id);
        model.setTodayTasks();
      });
    });
  }
}

export default new Project();
