import Modal from './Modal';

export default class EditModal extends Modal {
  _modalType = 'edit';

  _fillInputs({ title, description, dueDate }) {
    if (!this.state.isModalOpened) return;

    const form = this._parentElement.querySelector('form');
    const inputTitle = form.querySelector('[name="title"]');
    const inputDescription = form.querySelector('[name="description"]');
    const inputDate = form.querySelector('[name="dueDate"]');

    inputTitle.value = title;
    inputDescription.value = description;
    inputDate.value = dueDate;
  }

  _addHandlerFillInputs() {
    this._parentElement.addEventListener(
      'reef:render',
      this._fillInputs.bind(this)
    );
  }
}
