import { store, component } from 'reefjs';
import * as model from '../model';
import EditModal from './EditModal';

class EditTaskModal extends EditModal {
  _parentElement = document.querySelector('.edit-task-modal');

  constructor(state) {
    super();
    this._addHandlerCloseModal();
    this._addHandlerFillInputs();
    this._addHandlerSubmit();

    this.itemType = 'task';

    this.state = state;

    component(this._parentElement, this._template.bind(this), {
      stores: ['edit-task-modal'],
    });
  }

  _generateProjectsList() {
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

const state = store(
  {
    isModalOpened: false,
  },
  'edit-task-modal'
);

export default new EditTaskModal(state).state;
