import { store, component } from 'reefjs';
import * as model from '../model';
import AddModal from './AddModal';

class AddProjectModal extends AddModal {
  _parentElement = document.querySelector('.add-project-modal');
  _itemType = 'project';

  constructor(state) {
    super(state);
    this._addHandlerStoreInputCurChar(this._storeInputCurChar.bind(this));
    this._addHandlerCloseModal(this._closeModal.bind(this));
    this._addHandlerSubmit(this._submit.bind(this));

    component(this._parentElement, this._template.bind(this), {
      stores: ['add-project-modal', 'modal'],
    });
  }

  _submit(e) {
    super._submit({ event: e, handler: model.addProject });
  }
}

const state = store({ isModalOpened: false }, 'add-project-modal');

export default new AddProjectModal(state);
