import * as model from '../model';

export default class EditModal {
  _closeModal(e) {
    const btn = e.target.closest('.btn--close-modal');
    if (!btn) return;
    this.state.isModalOpened = false;
  }

  _fillInputs() {
    console.log(this);
    const form = this._parentElement.querySelector('form');

    if (!form) return;

    const inputTitle = form.querySelector('[name="title"]');
    const inputDescription = form.querySelector('[name="description"]');
    const inputDate = form.querySelector('[name="dueDate"]');

    const { title, description, dueDate } = model.ProjectControlsState.project;

    inputTitle.value = title;
    inputDescription.value = description;
    inputDate.value = dueDate;
  }

  _saveChanges(e) {
    e.preventDefault();

    const form = e.target;
    const dataArr = [...new FormData(form)];
    const data = Object.fromEntries(dataArr);

    if (this.itemType === 'project')
      model.editProject(model.ProjectControlsState.project, data);
    if (this.itemType === 'task')
      model.editTask(
        model.TaskControlsState.task,
        model.TaskControlsState.project,
        data
      );

    this.state.isModalOpened = false;
  }

  _addHandlerCloseModal() {
    this._parentElement.addEventListener('click', this._closeModal.bind(this));
  }

  _addHandlerFillInputs() {
    this._parentElement.addEventListener(
      'reef:render',
      this._fillInputs.bind(this)
    );
  }

  _addHandlerSaveChanges() {
    this._parentElement.addEventListener(
      'submit',
      this._saveChanges.bind(this)
    );
  }
}
