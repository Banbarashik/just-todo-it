import Modal from './Modal';
import * as model from '../model';
import { cap1stLtr } from '../helper';

export default class EditModal extends Modal {
  _modalType = 'edit';

  _closeModal(e) {
    const btn = e.target.closest('.btn--close-modal');
    if (!btn && e.type !== 'submit') return;

    this.state.areInputsFilled = false;
    super._closeModal(e);
  }

  _fillInputs() {
    if (!this.state.isModalOpened || this.state.areInputsFilled) return;

    //prettier-ignore
    const item = model[cap1stLtr(this._itemType) + 'Controls'].state[this._itemType];

    const form = this._parentElement.querySelector('form');
    const inputTitle = form.querySelector('[name="title"]');
    const inputDescription = form.querySelector('[name="description"]');
    const inputDate = form.querySelector('[name="date"]');
    const inputTime = form.querySelector('[name="time"]');

    inputTitle.value = item.title;
    inputDescription.value = item.description;
    inputDate.value = item.dueDate.dateStr;
    inputTime.value = item.dueDate.time;

    this.state.areInputsFilled = true;
  }

  _addHandlerFillInputs(handler) {
    this._parentElement.addEventListener('reef:render', handler);
  }
}
