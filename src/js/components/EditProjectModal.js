import { store, component } from 'reefjs';
import EditModal from './EditModal';

class EditProjectModal extends EditModal {
  _parentElement = document.querySelector('.edit-project-modal');

  constructor() {
    super();
    this._addHandlerCloseModal();
    this._addHandlerFillInputs();
    this._addHandlerSaveChanges();

    this.itemType = 'project';

    this.state = store(
      {
        isModalOpened: false,
      },
      'edit-project-modal'
    );

    component(this._parentElement, this._template.bind(this), {
      stores: ['edit-project-modal'],
    });
  }

  _template() {
    if (!this.state.isModalOpened) return '';

    return `
      <h3>Edit project</h3>
      <form class="edit-project-form">
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
        <button type="submit">Save</button>
      </form>
    `;
  }
}

export default new EditProjectModal().state;
