import { store, component } from 'reefjs';
import EditModal from './EditModal';

class EditProjectModal extends EditModal {
  _parentElement = document.querySelector('.edit-project-modal');

  constructor(state) {
    super();
    this._addHandlerCloseModal();
    this._addHandlerFillInputs();
    this._addHandlerSaveChanges();

    this.itemType = 'project';

    this.state = state;

    component(this._parentElement, this._template.bind(this), {
      stores: ['edit-project-modal'],
    });
  }
}

const state = store(
  {
    isModalOpened: false,
  },
  'edit-project-modal'
);

export default new EditProjectModal(state).state;
