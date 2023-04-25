import Modal from './Modal';

export default class EditModal extends Modal {
  _modalType = 'edit';

  _fillInputs({ title, description, dueDate: { dateStr, time } }) {
    const form = this._parentElement.querySelector('form');
    const inputTitle = form.querySelector('[name="title"]');
    const inputDescription = form.querySelector('[name="description"]');
    const inputDate = form.querySelector('[name="date"]');
    const inputTime = form.querySelector('[name="time"]');

    inputTitle.value = title;
    inputDescription.value = description;
    inputDate.value = dateStr;
    inputTime.value = time;
  }

  _addHandlerFillInputs(handler) {
    this._parentElement.addEventListener('reef:render', handler);
  }
}
