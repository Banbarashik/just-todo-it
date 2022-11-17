import { store, component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';
import EditModal from './EditModal';

class EditProjectModal extends EditModal {
  _parentElement = document.querySelector('.edit-project-modal');
  _itemType = 'project';

  constructor(state) {
    super();
    this._addHandlerCloseModal();
    this._addHandlerFillInputs();
    this._addHandlerSubmit();

    this.state = state;

    component(this._parentElement, this._template.bind(this), {
      stores: ['edit-project-modal'],
    });
  }

  _submit(e) {
    super._submit(e, model.editProject, model.ProjectControls.project);
  }

  _fillInputs() {
    if (!this.state.isModalOpened) return;
    super._fillInputs(model.ProjectControls.project);
  }
}

const state = store(
  {
    isModalOpened: false,
  },
  'edit-project-modal'
);

export default new EditProjectModal(state);
