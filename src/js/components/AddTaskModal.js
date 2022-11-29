import { store, component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';
import { mix } from '../helper';
import AddModal from './AddModal';
import TaskModalMixin from './TaskModal';

class AddTaskModal extends mix(AddModal).with(TaskModalMixin) {
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

    const id = e.target.querySelector('[name=project]').value;
    const project = [model.state.inbox, ...model.state.projects].find(
      project => project.id === id
    );
    project.tasks.sort(project.sortMethod);
  }
}

const state = store(
  {
    isModalOpened: false,
  },
  'add-task-modal'
);

export default new AddTaskModal(state);
