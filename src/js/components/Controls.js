export default class Controls {
  _template() {
    if (!this.state.areControlsOpened) return '';

    return `
      <div class="popper"
      style="top: ${this.state.elCoords.y}px; left: ${this.state.elCoords.x}px">
        <ul class="menu-list">
          ${
            this._itemType === 'task'
              ? `<li class="menu-item btn--complete-task">Mark ${
                  this.state.task.isCompleted ? 'un' : ''
                }completed</li>`
              : ''
          }
          ${
            this.state.task?.isCompleted
              ? ''
              : `<li class="menu-item btn--edit-item">Edit ${this._itemType}</li>`
          }
          <li class="menu-item btn--delete-item">Delete ${this._itemType}</li>
        </ul>
      </div>
    `;
  }

  _openEditModal(e, handler) {
    const btn = e.target.closest('.btn--edit-item');
    if (btn) handler();
  }

  _deleteItem({ event, handler, project, task }) {
    const btn = event.target.closest('.btn--delete-item');
    if (btn) handler({ project, task });
  }

  _addHandlerOpenControls(handler) {
    document.addEventListener('click', handler);
  }
  _addHandlerOpenEditModal(handler) {
    this._parentElement.addEventListener('click', handler);
  }
  _addHandlerDeleteItem(handler) {
    this._parentElement.addEventListener('click', handler);
  }
}
