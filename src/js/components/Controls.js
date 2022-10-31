import * as model from '../model';

export default class Controls {
  constructor() {
    this.project = {};
    this.task = {};
  }

  _template() {
    if (!this.state.areControlsOpened) return '';

    return `
      <button class="btn--edit-item">Edit ${this._itemType}</button>
      <button class="btn--delete-item">Delete ${this._itemType}</button>
    `;
  }

  _openEditModal(e) {
    const btn = e.target.closest('.btn--edit-item');
    if (!btn) return;
    if (this._itemType === 'project') model.EditProjectModal.openModal();
    if (this._itemType === 'task') model.EditTaskModal.openModal();
  }

  _addHandlerOpenEditModal() {
    this._parentElement.addEventListener(
      'click',
      this._openEditModal.bind(this)
    );
  }
}
