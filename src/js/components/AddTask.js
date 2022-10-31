import { component } from 'reefjs';
import * as model from '../model';

const _parentElement = document.querySelector('.btn--quick-add-task');

function _template() {
  return '+';
}

component(_parentElement, _template);

// EVENT LISTENERS

// OPEN THE 'ADD A TASK' MODAL
document.addEventListener('click', function (e) {
  const btnAddTask = e.target.closest('.btn--add-task');
  if (btnAddTask) model.AddTaskModal.openModal();
});
