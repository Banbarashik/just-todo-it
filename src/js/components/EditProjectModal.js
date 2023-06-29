import { store, component } from 'reefjs';
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
}

const state = store(
  { isModalOpened: false, areInputsFilled: false },
  'edit-project-modal'
);

export default new EditProjectModal(state);
