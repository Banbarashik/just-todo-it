import {
  PROJECT_DESCRIPTION_MAX_LENGTH,
  PROJECT_TITLE_MAX_LENGTH,
  TASK_DESCRIPTION_MAX_LENGTH,
  TASK_TITLE_MAX_LENGTH,
} from '../config';
import { cap1stLtr, getNonGetterObjPropValues } from '../helper';
import { store } from 'reefjs/src/reef';

class InputState {
  constructor(maxChar, isRequired = false) {
    this.curChar = 0;
    this.maxChar = maxChar;
    this.isRequired = isRequired;
    this.wasSubmitAttempt = false;
  }

  get isValid() {
    if (this.isRequired && this.curChar === 0) return false;
    return this.curChar <= this.maxChar;
  }
  get errorMsg() {
    if (this.isRequired && this.curChar === 0 && this.wasSubmitAttempt)
      return 'The field is required';

    return this.maxChar - this.curChar < 5
      ? 'Character limit: ' + this.curChar + ' / ' + this.maxChar
      : '';
  }
}

class ItemFormState {
  constructor(title, description) {
    this.title = title;
    this.description = description;
  }

  get isFormValid() {
    return getNonGetterObjPropValues(this).every(input => input.isValid);
  }
}

export default class Modal {
  constructor(instanceState) {
    this.state = instanceState;
  }

  static state = store(
    {
      project: new ItemFormState(
        new InputState(PROJECT_TITLE_MAX_LENGTH, true),
        new InputState(PROJECT_DESCRIPTION_MAX_LENGTH)
      ),
      task: new ItemFormState(
        new InputState(TASK_TITLE_MAX_LENGTH, true),
        new InputState(TASK_DESCRIPTION_MAX_LENGTH)
      ),
    },
    'modal'
  );

  _template() {
    if (!this.state.isModalOpened) return '';

    const itemFormState = Modal.state[this._itemType];

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
              ${
                itemFormState.title.errorMsg
                  ? `<span
                      class="${itemFormState.title.isValid ? '' : 'error'}">
                      ${itemFormState.title.errorMsg}
                     </span>`
                  : ''
              }
            </div>
            <div class="form-field form-field--desc">
              <label>Description</label>
              <textarea name="description"></textarea>
              ${
                itemFormState.description.errorMsg
                  ? `<span
                      class="${
                        itemFormState.description.isValid ? '' : 'error'
                      }">
                      ${itemFormState.description.errorMsg}
                     </span>`
                  : ''
              }
            </div>
            <div class="form-field form-field--due-date">
              <label>Due date</label>
              <div>
                <input type="date" name="date" />
                <input type="time" name="time" />
              </div>
            </div>
              ${
                this._itemType === 'task'
                  ? `<div class="form-field form-field--project">
                      <label>Project</label><select name="projectId">${this._generateProjectsList()}</select>
                     </div>
                    `
                  : ''
              }
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
      .forEach(function (input) {
        input.curChar = 0;
        input.wasSubmitAttempt = false;
      });
  }

  _storeInputCurChar(e) {
    const input = e.target;
    const itemFormState = Modal.state[this._itemType];

    if (itemFormState.hasOwnProperty(input.name))
      itemFormState[input.name].curChar = input.value.trimStart().length;
  }

  _closeModal(e) {
    const btn = e.target.closest('.btn--close-modal');
    if (!btn && e.type !== 'submit') return;

    this.state.isModalOpened = false;
    this._resetModalGlobalState();
  }

  _submit({ event, handler, projectId, taskId }) {
    event.preventDefault();

    const itemFormState = Modal.state[this._itemType];

    if (!itemFormState.isFormValid) {
      Object.values(itemFormState).forEach(input => { input.wasSubmitAttempt = true }); //prettier-ignore
      return;
    }

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
