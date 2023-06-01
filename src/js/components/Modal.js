import {
  PROJECT_DESCRIPTION_MAX_LENGTH,
  PROJECT_TITLE_MAX_LENGTH,
  TASK_DESCRIPTION_MAX_LENGTH,
  TASK_TITLE_MAX_LENGTH,
} from '../config';
import { cap1stLtr } from '../helper';
import { store } from 'reefjs/src/reef';

// TODO consider moving the class to its own module
class InputState {
  constructor(maxChar, isRequired = false) {
    this.curChar = 0;
    this.maxChar = maxChar;
    this.isRequired = isRequired;
  }

  // TODO come up with a condition for required fields
  get isValid() {
    if (this.isRequired && this.curChar === 0) return false;
    return this.curChar <= this.maxChar;
  }
  // TODO error msg in case a required field is empty
  get errorMsg() {
    return this.maxChar - this.curChar < 5
      ? 'Character limit: ' + this.curChar + ' / ' + this.maxChar
      : '';
  }
}

export default class Modal {
  constructor(instanceState) {
    this.state = instanceState;
  }

  static state = store(
    {
      project: {
        title: new InputState(PROJECT_TITLE_MAX_LENGTH, true),
        description: new InputState(PROJECT_DESCRIPTION_MAX_LENGTH),
        // TODO create a prototype to place the func in there
        get isFormValid() {
          return Object.values(Object.getOwnPropertyDescriptors(this))
            .filter(desc => desc.value)
            .map(desc => desc.value)
            .every(input => input.isValid);
        },
      },
      task: {
        title: new InputState(TASK_TITLE_MAX_LENGTH, true),
        description: new InputState(TASK_DESCRIPTION_MAX_LENGTH),
        get isFormValid() {
          return Object.values(Object.getOwnPropertyDescriptors(this))
            .filter(desc => desc.value)
            .map(desc => desc.value)
            .every(input => input.isValid);
        },
      },
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
                Modal.state[this._itemType].title.isValid ? '' : 'error'
              }">${Modal.state[this._itemType].title.errorMsg}</span>
            </div>
            <div class="form-field form-field--desc">
              <label>Description</label>
              <textarea name="description"></textarea>
              <span class="${
                Modal.state[this._itemType].description.isValid ? '' : 'error' //prettier-ignore
              }">${Modal.state[this._itemType].description.errorMsg}</span>
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
    Object.values(Modal.state)
      .map(itemType => Object.values(itemType))
      .flat()
      .filter(prop => typeof prop === 'object') // TODO remove it when the 'isFormValid' func will be moved to a prototype
      .forEach(input => (input.curChar = 0));
  }

  _storeInputCurChar(e) {
    const input = e.target;
    const item = Modal.state[this._itemType];
    const inputName = item.hasOwnProperty(input.name) ? input.name : null;

    if (inputName) item[inputName].curChar = input.value.length;
  }

  _closeModal(e) {
    const btn = e.target.closest('.btn--close-modal');
    if (!btn && e.type !== 'submit') return;

    this.state.isModalOpened = false;
    this._resetModalGlobalState();
  }

  _submit({ event, handler, projectId, taskId }) {
    event.preventDefault();

    if (!Modal.state[this._itemType].isFormValid) return;

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
  _addHandlerStoreInputCurChar(handler) {
    this._parentElement.addEventListener('input', handler);
  }
}
