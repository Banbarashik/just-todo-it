export default class Controls {
  _template() {
    if (!this.state.areControlsOpened) return '';

    return `
      <div class="controls" style="top: ${this.state.y}px; left: ${this.state.x}px">
        <button class="btn--edit-item">Edit ${this._itemType}</button>
        <button class="btn--delete-item">Delete ${this._itemType}</button>
      </div>
    `;
  }

  _openEditModal(e, handler) {
    const btn = e.target.closest('.btn--edit-item');
    if (btn) handler();
  }

  _deleteItem(e, handler, project, task) {
    const btn = e.target.closest('.btn--delete-item');
    if (btn) handler(project, task);
  }

  _addHandlerOpenControls() {
    document.addEventListener('click', this._openControls.bind(this));
  }
  _addHandlerOpenEditModal() {
    this._parentElement.addEventListener('click', this._openEditModal);
  }
  _addHandlerDeleteItem() {
    this._parentElement.addEventListener('click', this._deleteItem.bind(this));
  }
}
