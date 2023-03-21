import { store, component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';
import Controls from './Controls';

class TaskControls extends Controls {
  _parentElement = document.querySelector('.dropdown--task-controls');
  _itemType = 'task';

  constructor(state) {
    super();
    this._addHandlerOpenControls(this._openControls.bind(this));
    this._addHandlerOpenEditModal(this._openEditModal);
    this._addHandlerDeleteItem(this._deleteItem.bind(this));
    this._addHandlerToggleCompletion(this._toggleCompletion.bind(this));

    this.state = state;

    component(this._parentElement, this._template.bind(this));
  }

  _openControls(e) {
    const btn = e.target.closest('.btn--task-controls');

    if (!btn) {
      this.state.areControlsOpened = false;
      return;
    }

    this.state.areControlsOpened = true;

    const task = btn.closest('.task');
    const { id } = task.dataset;
    this.state.project = model
      .getProjectsWithOwnTasks()
      .find(project => project.tasks.some(task => task.id === id));
    this.state.task = this.state.project.tasks.find(task => task.id === id);

    const { left: x, bottom: y } = btn.getBoundingClientRect();
    this.state.elCoords = { x, y };
  }

  _openEditModal(e) {
    super._openEditModal(e, model.EditTaskModal.openModal);
  }

  _deleteItem(e) {
    super._deleteItem(e, model.deleteTask, this.state.project, this.state.task);
  }

  _toggleCompletion(e) {
    const btn = e.target.closest('.btn--complete-task');
    if (btn) model.toggleTaskCompletion(this.state.task);
  }

  _addHandlerToggleCompletion(handler) {
    this._parentElement.addEventListener('click', handler);
  }
}

const state = store({
  areControlsOpened: false,
  task: {},
  project: {},
  elCoords: { x: null, y: null },
});

export default new TaskControls(state);
