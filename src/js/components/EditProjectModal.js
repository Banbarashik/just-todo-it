import { store, component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';
import EditModal from './EditModal';

class EditProjectModal extends EditModal {
  _parentElement = document.querySelector('.edit-project-modal');
  _itemType = 'project';

  constructor(state) {
    super(state);
    this._addHandlerStoreInputCurChar(this._storeInputCurChar.bind(this));
    this._addHandlerCloseModal(this._closeModal.bind(this));
    this._addHandlerFillInputs(this._fillInputs.bind(this));
    this._addHandlerSubmit(this._submit.bind(this));

    component(this._parentElement, this._template.bind(this), {
      stores: ['edit-project-modal', 'modal'],
    });
  }

  _submit(e) {
    super._submit({
      event: e,
      handler: model.editProject,
      projectId: model.ProjectControls.state.project.id,
    });
  }

  _fillInputs() {
    if (!this.state.isModalOpened) return;
    super._fillInputs(model.ProjectControls.state.project);
  }
}

const state = store({ isModalOpened: false }, 'edit-project-modal');

export default new EditProjectModal(state);
