import { component } from 'reefjs';
import * as model from '../model';

const _btnAddTask = document.querySelector('.btn--add-task');

function _template() {
  return '+';
}

component(_btnAddTask, _template);

// EVENT LISTENERS

// OPEN THE 'ADD A TASK' MODAL
_btnAddTask.addEventListener('click', function () {
  model.AddTaskModalState.isModalOpened = true;
});
