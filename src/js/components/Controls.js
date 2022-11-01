export default class Controls {
  _template() {
    if (!this.state.areControlsOpened) return '';

    return `
      <button class="btn--edit-item">Edit ${this._itemType}</button>
      <button class="btn--delete-item">Delete ${this._itemType}</button>
    `;
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
