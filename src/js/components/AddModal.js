import * as model from '../model';

export default class AddModal {
  _closeModal(e) {
    const btn = e.target.closest('.btn--close-modal');
    if (!btn) return;
    this.state.isModalOpened = false;
  }

  _addItem(e) {
    e.preventDefault();

    const form = e.target;

    const dataArr = [...new FormData(form)];
    const data = Object.fromEntries(dataArr);

    const modalClassName = Object.getPrototypeOf(this).constructor.name;
    if (modalClassName === 'AddProjectModal') model.addProject(data);
    if (modalClassName === 'AddTaskModal') model.addTask(data);

    this.state.isModalOpened = false;
  }

  _addHandlerCloseModal() {
    this._parentElement.addEventListener('click', this._closeModal.bind(this));
  }

  _addHandlerAddItem() {
    this._parentElement.addEventListener('submit', this._addItem.bind(this));
  }
}
