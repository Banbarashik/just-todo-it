import { component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';

class AddProject {
  _parentElement = document.querySelector('.btn--add-project');

  constructor() {
    this._addHandlerOpenModal(model.AddProjectModal.openModal);

    component(this._parentElement, this._template);
  }

  _template() {
    return '+';
  }

  _addHandlerOpenModal(handler) {
    this._parentElement.addEventListener('click', handler);
  }
}

new AddProject();
