import { store, component } from 'reefjs';
import * as model from '../model';

const _parentElement = document.querySelector('.task-controls');

const state = store(
  {
    areTaskControlsOpened: false,
    project: {},
    task: {},
  },
  'task-controls'
);

function _template() {
  if (!state.areTaskControlsOpened) return '';

  return `
    <button class="task__btn--edit">Edit task</button>
    <button class="task__btn--delete">Delete task</button>
  `;
}

component(_parentElement, _template, { stores: ['task-controls'] });

// EVENT LISTENERS

// OPEN TASK CONTROLS
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.btn--task-controls');

  if (!btn) {
    state.areTaskControlsOpened = false;
    return;
  }

  const task = btn.closest('.task');
  const { id } = task.dataset;

  state.areTaskControlsOpened = true;
  state.project = model.state.projects.find(project =>
    project.tasks.some(task => task.id === id)
  );
  state.task = state.project.tasks.find(task => task.id === id);
});

// DELETE A TASK
_parentElement.addEventListener('click', function (e) {
  const btnDeleteTask = e.target.closest('.task__btn--delete');
  if (!btnDeleteTask) return;

  const index = state.project.tasks.findIndex(
    task => task.id === state.task.id
  );

  state.project.tasks.splice(index, 1);
});

// OPEN THE 'EDIT A TASK' MODAL
_parentElement.addEventListener('click', function (e) {
  const btnEditTask = e.target.closest('.task__btn--edit');
  if (!btnEditTask) return;

  model.EditTaskModalState.isModalOpened = true;
});

export default state;
