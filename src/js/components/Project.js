import { component } from 'reefjs';
import * as model from '../model';

const _parentElement = document.querySelector('.project-window');

function _template() {
  if (!Object.keys(model.state.activeProject).length) return '';

  return `
    <div class="project" data-id="${model.state.activeProject.id}">
      <p class="project__title">Title: ${model.state.activeProject.title}</p>
      <p class="project__description">Description: ${
        model.state.activeProject.description
      }</p>
      <p class="project__due-date">Due date: ${
        model.state.activeProject.dueDate
          ? model.state.activeProject.dueDate
          : 'No due date'
      }</p>
      <p>TASKS:</p>
      <ul class="tasks">
        ${_generateTasksMarkup(model.state.activeProject.tasks)}
      </ul>
      <button class="btn--project-controls">...</button>
      <button class="btn--add-task">Add task</button>
    </div>
  `;
}

function _generateTasksMarkup(tasks) {
  return tasks
    .map(function (task) {
      return `
        <li class="task" data-id="${task.id}">
          <p class="task__title">Title: ${task.title}</p>
          <p class="task__description">Description: ${task.description}</p>
          <p class="task__due-date">Due date: ${
            task.dueDate ? task.dueDate : 'No due date'
          }</p>
        <button class="btn--task-controls">...</button>
        </li>
      `;
    })
    .join('');
}

component(_parentElement, _template);

// EVENT LISTENERS

// Set the project as active (i.e., render it)
['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, function () {
    const id = window.location.hash.slice(1);
    if (!id) return;
    model.setProjectAsActive(id);
  })
);
