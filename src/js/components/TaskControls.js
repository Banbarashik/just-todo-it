import { store, component } from 'reefjs';
import * as model from '../model';
import Controls from './Controls';

class TaskControls extends Controls {
  _parentElement = document.querySelector('.task-controls');

  constructor(state) {
    super();
    this._addHandlerOpenControls();
    this._addHandlerOpenEditModal();
    this._addHandlerDeleteItem();

    this.itemType = 'task';

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

    const task = btn.closest('.task');
    const { id } = task.dataset;
    this.project = model.state.projects.find(project =>
      project.tasks.some(task => task.id === id)
    );
    this.task = this.project.tasks.find(task => task.id === id);
    this.state.areControlsOpened = true;
  }

  _deleteItem(e) {
    const btn = e.target.closest('.btn--delete-item');
    if (!btn) return;

    const index = this.project.tasks.findIndex(
      task => task.id === this.task.id
    );

    this.project.tasks.splice(index, 1);
  }

  _addHandlerOpenControls() {
    document.addEventListener('click', this._openControls.bind(this));
  }

  _addHandlerDeleteItem() {
    this._parentElement.addEventListener('click', this._deleteItem.bind(this));
  }
}

const state = store(
  {
    areControlsOpened: false,
  },
  'task-controls'
);

export default new TaskControls(state);
