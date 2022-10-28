import * as model from '../model';

export default class EditModal {
  _template() {
    if (!this.state.isModalOpened) return '';

    return `
      <h3>Edit ${this.itemType}</h3>
      <form class="edit-${this.itemType}-form">
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
        <button type="submit" data-mode="add">Save</button>
      </form>
    `;
  }

  _closeModal(e) {
    const btn = e.target.closest('.btn--close-modal');
    if (!btn) return;
    this.state.isModalOpened = false;
  }

  _fillInputs() {
    if (!this.state.isModalOpened) return;

    const form = this._parentElement.querySelector('form');
    const inputTitle = form.querySelector('[name="title"]');
    const inputDescription = form.querySelector('[name="description"]');
    const inputDate = form.querySelector('[name="dueDate"]');

    // check the type of an item and if it's stored
    const { title, description, dueDate } =
      (this.itemType === 'project' && model.ProjectControlsState.project) ||
      (this.itemType === 'task' && model.TaskControlsState.task);

    inputTitle.value = title;
    inputDescription.value = description;
    inputDate.value = dueDate;
  }

  _saveChanges(e) {
    e.preventDefault();

    const form = e.target;
    const dataArr = [...new FormData(form)];
    const data = Object.fromEntries(dataArr);

    if (this.itemType === 'project')
      model.editProject(model.ProjectControlsState.project, data);
    if (this.itemType === 'task')
      model.editTask(
        model.TaskControlsState.task,
        model.TaskControlsState.project,
        data
      );

    this.state.isModalOpened = false;
  }

  _addHandlerCloseModal() {
    this._parentElement.addEventListener('click', this._closeModal.bind(this));
  }

  _addHandlerFillInputs() {
    this._parentElement.addEventListener(
      'reef:render',
      this._fillInputs.bind(this)
    );
  }

  _addHandlerSaveChanges() {
    this._parentElement.addEventListener(
      'submit',
      this._saveChanges.bind(this)
    );
  }
}
