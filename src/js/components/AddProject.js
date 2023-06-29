import { component } from 'reefjs';
import * as model from '../model';

class AddProject {
  _parentElement = document.querySelector('.btn--add-project');

  constructor() {
    this._addHandlerOpenModal(model.AddProjectModal.openModal);

    component(this._parentElement, this._template.bind(this));
  }

  _template() {
    return '+';
  }

  _addHandlerOpenModal(handler) {
    this._parentElement.addEventListener('click', handler);
  }
}

new AddProject();
