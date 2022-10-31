import { store, component } from 'reefjs';
import * as model from '../model';
import AddModal from './AddModal';

class AddTaskModal extends AddModal {
  _parentElement = document.querySelector('.add-task-modal');

  constructor(state) {
    super();
    this._addHandlerCloseModal();
    this._addHandlerSubmit();

    this.itemType = 'task';

    this.state = state;

    component(this._parentElement, this._template.bind(this), {
      stores: ['add-task-modal'],
    });
  }

  _generateProjectsList() {
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

const state = store(
  {
    isModalOpened: false,
  },
  'add-task-modal'
);

export default new AddTaskModal(state);
