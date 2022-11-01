export default class Modal {
  _template() {
    if (!this.state.isModalOpened) return '';

    return `
      <h3>${this._modalType} ${this._itemType}</h3>
      <form class="${this._modalType}-${this._itemType}-form">
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
          this._itemType === 'task'
            ? `<select name="project">${this._generateProjectsList()}</select>`
            : ''
        }
        <button type="button" class="btn--close-modal">Cancel</button>
        <button type="submit">${
          this._modalType === 'edit' ? 'Save' : this._modalType
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

  _submit(e, handler, project, task) {
    e.preventDefault();
    const form = e.target;
    const dataArr = [...new FormData(form)];
    const data = Object.fromEntries(dataArr);
    handler(data, project, task);
    this.state.isModalOpened = false;
  }

  _addHandlerCloseModal() {
    this._parentElement.addEventListener('click', this._closeModal.bind(this));
  }
  _addHandlerSubmit() {
    this._parentElement.addEventListener('submit', this._submit.bind(this));
  }
}
