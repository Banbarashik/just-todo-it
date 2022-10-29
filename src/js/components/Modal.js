import * as model from '../model';

export default class Modal {
  _template() {
    if (!this.state.isModalOpened) return '';

    return `
      <h3>${this.modalType} ${this.itemType}</h3>
      <form class="${this.modalType}-${this.itemType}-form">
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
        <button type="submit">${
          this.modalType === 'edit' ? 'Save' : this.modalType
        }</button>
      </form>
    `;
  }

  openModal() {
    this.state.isModalOpened = true;
  }

  _closeModal(e) {
    const btn = e.target.closest('.btn--close-modal');
    if (!btn) return;
    this.state.isModalOpened = false;
  }

  _submit(e) {
    e.preventDefault();

    const form = e.target;
    const dataArr = [...new FormData(form)];
    const data = Object.fromEntries(dataArr);

    if (this.modalType === 'add' && this.itemType === 'project')
      model.addProject(data);
    if (this.modalType === 'add' && this.itemType === 'task')
      model.addTask(data);
    if (this.modalType === 'edit' && this.itemType === 'project')
      model.editProject(model.ProjectControls.project, data);
    if (this.modalType === 'edit' && this.itemType === 'task')
      model.editTask(model.TaskControls.task, model.TaskControls.project, data);

    this.state.isModalOpened = false;
  }

  _addHandlerCloseModal() {
    this._parentElement.addEventListener('click', this._closeModal.bind(this));
  }

  _addHandlerSubmit() {
    this._parentElement.addEventListener('submit', this._submit.bind(this));
  }
}
