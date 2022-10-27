import { store, component } from 'reefjs';
import * as model from '../model';
import AddModal from './AddModal';

class AddTaskModal extends AddModal {
  _parentElement = document.querySelector('.add-task-modal');

  constructor(state) {
    super();
    this._addHandlerCloseModal();
    this._addHandlerAddItem();

    this.itemType = 'task';

    this.state = state;

    component(this._parentElement, this._template.bind(this), {
      stores: ['add-task-modal'],
    });
  }

  _template() {
    if (!this.state.isModalOpened) return '';

    return `
      <h3>Add a task</h3>
      <form class="add-task-form">
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
        <button type="submit" data-mode="add">Add</button>
      </form>
    `;

    function _generateProjectsList() {
      const { id } = model.state.activeProject;

      return model.state.projects
        .map(
          project =>
            `<option ${project.id === id ? 'selected' : ''}
             value="${project.id}">${project.title}</option>`
        )
        .join('');
    }
  }
}

const state = store(
  {
    isModalOpened: false,
  },
  'add-task-modal'
);

export default new AddTaskModal(state).state;
