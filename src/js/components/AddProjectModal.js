import { store, component } from 'reefjs';
import AddModal from './AddModal';

class AddProjectModal extends AddModal {
  _parentElement = document.querySelector('.add-project-modal');

  constructor(state) {
    super();
    this._addHandlerCloseModal();
    this._addHandlerSubmit();

    this.itemType = 'project';

    this.state = state;

    component(this._parentElement, this._template.bind(this), {
      stores: ['add-project-modal'],
    });
  }
}

const state = store(
  {
    isModalOpened: false,
  },
  'add-project-modal'
);

export default new AddProjectModal(state);
