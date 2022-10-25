import { store, component } from 'reefjs';
import * as model from '../model';

const _parentElement = document.querySelector('.task-controls');

const state = store(
  {
    areTaskControlsOpened: false,
    targetTaskId: null,
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
  state.targetTaskId = id;
});

// DELETE A TASK
_parentElement.addEventListener('click', function (e) {
  const btnDeleteTask = e.target.closest('.task__btn--delete');
  if (!btnDeleteTask) return;

  const project = model.state.projects.find(project =>
    project.tasks.some(task => task.id === state.targetTaskId)
  );

  const index = project.tasks.findIndex(task => task.id === state.targetTaskId);

  project.tasks.splice(index, 1);
});

/* 
// OPEN THE 'EDIT A PROJECT' MODAL
document.addEventListener('click', function (e) {
  const btnEditModal = e.target.closest('.project__btn--edit');
  if (!btnEditModal) return;

  model.EditTaskModalState.isModalOpened = true;
});
 */

export default state;
