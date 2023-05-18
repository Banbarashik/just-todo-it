import { store, component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';
import { mix } from '../helper';
import AddModal from './AddModal';
import TaskModalMixin from './TaskModal';

class AddTaskModal extends mix(AddModal).with(TaskModalMixin) {
  _parentElement = document.querySelector('.add-task-modal');
  _itemType = 'task';

  constructor(state) {
    super(state);
    this._addHandlerCloseModal(this._closeModal.bind(this));
    this._addHandlerSubmit(this._submit.bind(this));

    component(this._parentElement, this._template.bind(this), {
      stores: ['add-task-modal', 'modal'],
    });
  }

  _submit(e) {
    super._submit({ event: e, handler: model.addTask });
  }
}

const state = store({ isModalOpened: false }, 'add-task-modal');

export default new AddTaskModal(state);
