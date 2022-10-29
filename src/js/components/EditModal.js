import * as model from '../model';
import Modal from './Modal';

export default class EditModal extends Modal {
  constructor() {
    super();
    this.modalType = 'edit';
  }

  _fillInputs() {
    if (!this.state.isModalOpened) return;

    const form = this._parentElement.querySelector('form');
    const inputTitle = form.querySelector('[name="title"]');
    const inputDescription = form.querySelector('[name="description"]');
    const inputDate = form.querySelector('[name="dueDate"]');

    // check the type of an item and if it's stored
    const { title, description, dueDate } =
      (this.itemType === 'project' && model.ProjectControls.project) ||
      (this.itemType === 'task' && model.TaskControls.task);

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
