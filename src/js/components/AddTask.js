import { component } from '../../../node_modules/reefjs/src/reef';
import * as model from '../model';

class AddTask {
  _parentElement = document.querySelector('.btn--quick-add-task');

  constructor() {
    this._addHandlerOpenModal();

    component(this._parentElement, this._template);
  }

  _template() {
    return `
      <svg width="40" viewBox="0 0 512 512">
        <title>Add task</title>
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="50" d="M256 112v288M400 256H112"/>
      </svg>
    `;
  }

  _addHandlerOpenModal() {
    document.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--add-task');
      if (btn) model.AddTaskModal.openModal();
    });
  }
}

new AddTask();
