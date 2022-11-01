import { component } from 'reefjs';
import * as model from '../model';

class AddTask {
  _parentElement = document.querySelector('.btn--quick-add-task');

  constructor() {
    this._addHandlerOpenModal();

    component(this._parentElement, this._template);
  }

  _template() {
    return '+';
  }

  _addHandlerOpenModal() {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--add-task');
      if (btn) model.AddTaskModal.openModal();
    });
  }
}

new AddTask();
