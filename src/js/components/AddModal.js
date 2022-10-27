import * as model from '../model';

export default class AddModal {
  _template() {
    if (!this.state.isModalOpened) return '';

    return `
      <h3>Add ${this.itemType}</h3>
      <form class="add-project-form">
        <div class="form-field">
          <label>Title</label>
          <input name="title" />
        </div>
        <div class="form-field">
          <label>Description</label>
          <textarea name="description" cols="30" rows="5"></textarea>
        </div>
        <div class="form-field">
          <label>Due date</label>
          <input type="datetime-local" name="dueDate" />
        </div>
        ${
          this.itemType === 'task'
            ? `<select name="project">${this._generateProjectsList()}</select>`
            : ''
        }
        <button type="button" class="btn--close-modal">Cancel</button>
        <button type="submit" data-mode="add">Add</button>
      </form>
    `;
  }

  _closeModal(e) {
    const btn = e.target.closest('.btn--close-modal');
    if (!btn) return;
    this.state.isModalOpened = false;
  }

  _addItem(e) {
    e.preventDefault();

    const form = e.target;
    const dataArr = [...new FormData(form)];
    const data = Object.fromEntries(dataArr);

    if (this.itemType === 'project') model.addProject(data);
    if (this.itemType === 'task') model.addTask(data);

    this.state.isModalOpened = false;
  }

  _addHandlerCloseModal() {
    this._parentElement.addEventListener('click', this._closeModal.bind(this));
  }

  _addHandlerAddItem() {
    this._parentElement.addEventListener('submit', this._addItem.bind(this));
  }
}
