import Modal from './Modal';

export default class EditModal extends Modal {
  _modalType = 'edit';

  _fillInputs({ title, description, dueDate: { date, time } }) {
    const form = this._parentElement.querySelector('form');
    const inputTitle = form.querySelector('[name="title"]');
    const inputDescription = form.querySelector('[name="description"]');
    const inputDate = form.querySelector('[name="date"]');
    const inputTime = form.querySelector('[name="time"]');

    inputTitle.value = title;
    inputDescription.value = description;
    inputDate.value = date;
    inputTime.value = time;
  }

  _addHandlerFillInputs() {
    this._parentElement.addEventListener(
      'reef:render',
      this._fillInputs.bind(this)
    );
  }
}
