import { store, component } from 'reefjs';
import * as model from '../model';

import EditModal from './EditModal';

class EditTaskModal extends EditModal {
  _parentElement = document.querySelector('.edit-task-modal');

  constructor() {
    super();
    this._addHandlerCloseModal();
    this._addHandlerFillInputs();
    this._addHandlerSaveChanges();

    this.itemType = 'task';

    this.state = store(
      {
        isModalOpened: false,
      },
      'edit-task-modal'
    );

    component(this._parentElement, this._template.bind(this), {
      stores: ['edit-task-modal'],
    });
  }

  _template() {
    if (!this.state.isModalOpened) return '';

    return `
      <h3>Edit task</h3>
      <form class="edit-task-form">
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
        <select name="project">${_generateProjectsList()}</select>
        <button type="button" class="btn--close-modal">Cancel</button>
        <button type="submit">Save</button>
      </form>
    `;

    function _generateProjectsList() {
      const { id } = model.state.activeProject;

      return model.state.projects
        .map(
          project =>
            // not very robust cause the edited task (not now, but theoretically)
            // can belong to a project that is not active
            `<option ${project.id === id ? 'selected' : ''}
             value="${project.id}">${project.title}</option>`
        )
        .join('');
    }
  }
}

export default new EditTaskModal().state;
