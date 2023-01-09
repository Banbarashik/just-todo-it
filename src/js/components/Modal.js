import { cap1stLtr } from '../helper';

export default class Modal {
  _template() {
    if (!this.state.isModalOpened) return '';

    return `
      <div class="overlay"></div>
      <div class="modal">
        <h3>${cap1stLtr(this._modalType)} ${this._itemType}</h3>
        <form class="${this._itemType}-form ${this._modalType}-${
      this._itemType
    }-form">
          <div class="form-fields-block">
            <div class="form-field form-field--title">
              <label>Title</label>
              <input name="title" />
            </div>
            <div class="form-field form-field--desc">
              <label>Description</label>
              <textarea name="description"></textarea>
            </div>
            <div class="form-field form-field--due-date">
              <label>Due date</label>
              <div>
                <input type="date" name="date" />
                <input type="time" name="time" />
              </div>
            </div>
            <div class="form-field form-field--project">
              ${
                this._itemType === 'task'
                  ? `<label>Project</label><select name="projectId">${this._generateProjectsList()}</select>`
                  : ''
              }
            </div>
          </div>
          <div class="form-btns-block">
            <button type="button" class="btn--close-modal">Cancel</button>
            <button type="submit">${
              this._modalType === 'edit' ? 'Save' : cap1stLtr(this._modalType)
            }</button>
          </div>
        </form>
      </div>
    `;
  }

  openModal() {
    this.state.isModalOpened = true;
  }
  openModal = this.openModal.bind(this);

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
