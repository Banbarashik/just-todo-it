import icons from '../../img/icons.svg';

import { component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';

class AddTask {
  _parentElement = document.querySelector('.btn--quick-add-task');

  constructor() {
    this._addHandlerOpenModal(model.AddTaskModal.openModal);

    component(this._parentElement, this._template.bind(this));
  }

  _template() {
    return `<svg><title>Add task</title><use href="${icons}#icon-add-task"></use></svg>`;
  }

  _addHandlerOpenModal(handler) {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--add-task');
      if (btn) handler();
    });
  }
}

new AddTask();
