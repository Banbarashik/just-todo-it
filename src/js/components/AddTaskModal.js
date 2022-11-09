import { store, component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';
import AddModal from './AddModal';

class AddTaskModal extends AddModal {
  _parentElement = document.querySelector('.add-task-modal');
  _itemType = 'task';

  constructor(state) {
    super();
    this._addHandlerCloseModal();
    this._addHandlerSubmit();

    this.state = state;

    component(this._parentElement, this._template.bind(this), {
      stores: ['add-task-modal'],
    });
  }

  _submit(e) {
    super._submit(e, model.addTask);
  }

  _generateProjectsList() {
    const { id } = model.state.activeProject;

    return [model.state.inbox, ...model.state.projects]
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
