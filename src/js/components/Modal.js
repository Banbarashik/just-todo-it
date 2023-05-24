import {
  PROJECT_DESCRIPTION_MAX_LENGTH,
  PROJECT_TITLE_MAX_LENGTH,
  TASK_DESCRIPTION_MAX_LENGTH,
  TASK_TITLE_MAX_LENGTH,
} from '../config';
import { cap1stLtr } from '../helper';
import { store } from 'reefjs/src/reef';

class InputState {
  constructor(maxChar) {
    this.curChar = 0;
    this.maxChar = maxChar;
  }

  get isValid() {
    return this.curChar <= this.maxChar;
  }
  get errorMsg() {
    return this.maxChar - this.curChar < 5
      ? 'Character limit: ' + this.curChar + '/' + this.maxChar
      : '';
  }
}

export default class Modal {
  constructor(instanceState) {
    this.state = instanceState;
  }

  static state = store(
    {
      projectTitle: new InputState(PROJECT_TITLE_MAX_LENGTH),
      projectDescription: new InputState(PROJECT_DESCRIPTION_MAX_LENGTH),
      taskTitle: new InputState(TASK_TITLE_MAX_LENGTH),
      taskDescription: new InputState(TASK_DESCRIPTION_MAX_LENGTH),
    },
    'modal'
  );

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
              <input type="text" name="title" />
              <span class="${
                Modal.state[this._itemType + 'Title'].isValid ? '' : 'error'
              }">${Modal.state[this._itemType + 'Title'].errorMsg}</span>
            </div>
            <div class="form-field form-field--desc">
              <label>Description</label>
              <textarea name="description"></textarea>
              <span class="${
                Modal.state[this._itemType + 'Description'].isValid ? '' : 'error' //prettier-ignore
              }">${Modal.state[this._itemType + 'Description'].errorMsg}</span>
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

  get openModal() {
    return function () {
      this.state.isModalOpened = true;
    }.bind(this);
  }

  _resetModalGlobalState() {
    for (const key in Modal.state) Modal.state[key].curChar = 0;
  }

  _closeModal(e) {
    const btn = e.target.closest('.btn--close-modal');
    if (!btn && e.type !== 'submit') return;
    this.state.isModalOpened = false;
    this._resetModalGlobalState();
  }

  _submit({ event, handler, projectId, taskId }) {
    event.preventDefault();
    const form = event.target;
    const dataArr = [...new FormData(form)];
    const formData = Object.fromEntries(dataArr);
    handler({ formData, projectId, taskId });
    this._closeModal(event);
  }

  _addHandlerCloseModal(handler) {
    this._parentElement.addEventListener('click', handler);
  }
  _addHandlerSubmit(handler) {
    this._parentElement.addEventListener('submit', handler);
  }
}
