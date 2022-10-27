import { store, component } from 'reefjs';
import AddModal from './AddModal';

class AddProjectModal extends AddModal {
  _parentElement = document.querySelector('.add-project-modal');

  constructor(state) {
    super();
    this._addHandlerCloseModal();
    this._addHandlerAddItem();

    this.state = state;

    component(this._parentElement, this._template.bind(this), {
      stores: ['add-project-modal'],
    });
  }

  _template() {
    if (!this.state.isModalOpened) return '';

    return `
      <h3>Add project</h3>
      <form class="add-project-form">
        <div class="form-field">
          <label>Title</label>
          <input name="title" />
        </div>
        <div class="form-field">
          <label>Description</label>
          <textarea name="description" cols="30" rows="5"></textarea>
        </div>
        <div class="form-field">
          <label>Due date</label>
          <input type="datetime-local" name="dueDate" />
        </div>
        <button type="button" class="btn--close-modal">Cancel</button>
        <button type="submit" data-mode="add">Add</button>
      </form>
    `;
  }
}

const state = store(
  {
    isModalOpened: false,
  },
  'add-project-modal'
);

export default new AddProjectModal(state).state;
