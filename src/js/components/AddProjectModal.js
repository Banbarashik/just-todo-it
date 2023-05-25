import { store, component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';
import AddModal from './AddModal';

class AddProjectModal extends AddModal {
  _parentElement = document.querySelector('.add-project-modal');
  _itemType = 'project';

  constructor(state) {
    super(state);
    this._addHandlerCloseModal(this._closeModal.bind(this));
    this._addHandlerSubmit(this._submit.bind(this));

    this._parentElement.addEventListener('input', function ({ target: input }) {
      if (input.name === 'title')
        AddProjectModal.state.project.title.curChar = input.value.length;
      if (input.name === 'description')
        AddProjectModal.state.project.description.curChar = input.value.length;
    });

    component(this._parentElement, this._template.bind(this), {
      stores: ['add-project-modal', 'modal'],
    });
  }

  _submit(e) {
    if (
      !AddProjectModal.state.project.title.isValid ||
      !AddProjectModal.state.project.description.isValid
    ) {
      e.preventDefault();
      return;
    }

    super._submit({ event: e, handler: model.addProject });
  }
}

const state = store({ isModalOpened: false }, 'add-project-modal');

export default new AddProjectModal(state);
