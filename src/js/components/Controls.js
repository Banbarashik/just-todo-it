export default class Controls {
  _template() {
    if (!this.state.areControlsOpened) return '';

    return `
      <div class="popper" style="top: ${this.state.y}px; left: ${this.state.x}px">
        <ul class="menu-list">
          <li class="menu-item btn--edit-item">Edit ${this._itemType}</li>
          <li class="menu-item btn--delete-item">Delete ${this._itemType}</li>
        </ul>
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
