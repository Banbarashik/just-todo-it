import { store, component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';
import Controls from './Controls';

class TaskControls extends Controls {
  _parentElement = document.querySelector('.dropdown--task-controls');
  _itemType = 'task';

  constructor(state) {
    super();
    this._addHandlerOpenControls();
    this._addHandlerOpenEditModal();
    this._addHandlerDeleteItem();
    this._addHandlerToggleCompletion();

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
    this.state.project = [model.state.inbox, ...model.state.projects].find(
      project => project.tasks.some(task => task.id === id)
    );
    this.state.task = this.state.project.tasks.find(task => task.id === id);

    const rect = btn.getBoundingClientRect();
    this.state.elementPosition = {
      x: rect.left,
      y: rect.bottom,
    };
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

  _addHandlerToggleCompletion() {
    this._parentElement.addEventListener(
      'click',
      this._toggleCompletion.bind(this)
    );
  }
}

const state = store({
  areControlsOpened: false,
  task: {},
  project: {},
  elementPosition: {
    x: null,
    y: null,
  },
});

export default new TaskControls(state);
