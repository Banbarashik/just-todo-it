import { store, component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';
import { mix } from '../helper';
import EditModal from './EditModal';
import TaskModalMixin from './TaskModal';

class EditTaskModal extends mix(EditModal).with(TaskModalMixin) {
  _parentElement = document.querySelector('.edit-task-modal');
  _itemType = 'task';

  constructor(state) {
    super(state);
    this._addHandlerStoreInputCurChar(this._storeInputCurChar.bind(this));
    this._addHandlerCloseModal(this._closeModal.bind(this));
    this._addHandlerFillInputs(this._fillInputs.bind(this));
    this._addHandlerSubmit(this._submit.bind(this));

    component(this._parentElement, this._template.bind(this), {
      stores: ['edit-task-modal', 'modal'],
    });
  }

  _submit(e) {
    super._submit({
      event: e,
      handler: model.editTask,
      projectId: model.TaskControls.state.project.id,
      taskId: model.TaskControls.state.task.id,
    });
  }

  _fillInputs() {
    if (!this.state.isModalOpened) return;
    super._fillInputs(model.TaskControls.state.task);
  }
}

const state = store({ isModalOpened: false }, 'edit-task-modal');

export default new EditTaskModal(state);
