import { store, component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';
import Controls from './Controls';

class TaskControls extends Controls {
  _parentElement = document.querySelector('.task-controls');
  _itemType = 'task';

  constructor(state) {
    super();
    this._addHandlerOpenControls();
    this._addHandlerOpenEditModal();
    this._addHandlerDeleteItem();

    this.project = {};
    this.task = {};

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
    this.project = [model.state.inbox, ...model.state.projects].find(project =>
      project.tasks.some(task => task.id === id)
    );
    this.task = this.project.tasks.find(task => task.id === id);

    const rect = btn.getBoundingClientRect();
    this.state.y = rect.bottom;
    this.state.x = rect.left;
  }

  _openEditModal(e) {
    const btn = e.target.closest('.btn--edit-item');
    if (btn) model.EditTaskModal.openModal();
  }

  _deleteItem(e) {
    const btn = e.target.closest('.btn--delete-item');
    if (!btn) return;

    const index = this.project.tasks.findIndex(
      task => task.id === this.task.id
    );

    this.project.tasks.splice(index, 1);

    if (model.state.activeProject.id === 'today') model.setTodayTasks();
  }
}

const state = store(
  {
    areControlsOpened: false,
    x: null,
    y: null,
  },
  'task-controls'
);

export default new TaskControls(state);
