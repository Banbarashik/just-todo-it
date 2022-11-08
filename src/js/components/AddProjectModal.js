import { store, component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';
import AddModal from './AddModal';

class AddProjectModal extends AddModal {
  _parentElement = document.querySelector('.add-project-modal');
  _itemType = 'project';

  constructor(state) {
    super();
    this._addHandlerCloseModal();
    this._addHandlerSubmit();

    this.state = state;

    component(this._parentElement, this._template.bind(this), {
      stores: ['add-project-modal'],
    });
  }

  _submit(e) {
    super._submit(e, model.addProject);
  }
}

const state = store(
  {
    isModalOpened: false,
  },
  'add-project-modal'
);

export default new AddProjectModal(state);
