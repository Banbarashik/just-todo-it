import { store, component } from 'reefjs';
import * as model from '../model';
import Controls from './Controls';

class TaskControls extends Controls {
  _parentElement = document.querySelector('.dropdown--task-controls');
  _itemType = 'task';

  constructor(state) {
    super();
    this._addHandlerOpenControls(this._openControls.bind(this));
    this._addHandlerOpenEditModal(this._openEditModal.bind(this));
    this._addHandlerDeleteItem(this._deleteItem.bind(this));
    this._addHandlerToggleCompletion(this._toggleCompletion.bind(this));

    this.state = state;

    component(this._parentElement, this._template.bind(this), {
      stores: ['task-controls'],
    });
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
    super._deleteItem({
      event: e,
      handler: model.deleteTask,
      projectId: this.state.project.id,
      taskId: this.state.task.id,
    });
  }

  _toggleCompletion(e) {
    const btn = e.target.closest('.btn--complete-task');
    if (btn)
      model.toggleTaskCompletion(this.state.task.id, this.state.project.id);
  }

  _addHandlerToggleCompletion(handler) {
    this._parentElement.addEventListener('click', handler);
  }
}

const state = store(
  {
    areControlsOpened: false,
    task: {},
    project: {},
    elCoords: { x: null, y: null },
  },
  'task-controls'
);

export default new TaskControls(state);
