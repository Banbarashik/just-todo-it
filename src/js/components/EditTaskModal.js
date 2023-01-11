import { store, component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';
import { mix } from '../helper';
import EditModal from './EditModal';
import TaskModalMixin from './TaskModal';

class EditTaskModal extends mix(EditModal).with(TaskModalMixin) {
  _parentElement = document.querySelector('.edit-task-modal');
  _itemType = 'task';

  constructor(state) {
    super();
    this._addHandlerCloseModal();
    this._addHandlerFillInputs();
    this._addHandlerSubmit();

    this.state = state;

    component(this._parentElement, this._template.bind(this), {
      stores: ['edit-task-modal'],
    });
  }

  _submit(e) {
    super._submit(
      e,
      model.editTask,
      model.TaskControls.state.project,
      model.TaskControls.state.task
    );
    model.state.activeProject.sortingMethod.body();
  }

  _fillInputs() {
    if (!this.state.isModalOpened) return;
    super._fillInputs(model.TaskControls.state.task);
  }
}

const state = store(
  {
    isModalOpened: false,
  },
  'edit-task-modal'
);

export default new EditTaskModal(state);
