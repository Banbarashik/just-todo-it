import { component } from 'reefjs';
import * as model from '../model';

const _btnAddProject = document.querySelector('.btn--add-project');

function _template() {
  return '+';
}

component(_btnAddProject, _template);

// EVENT LISTENERS

// OPEN THE 'ADD A PROJECT' MODAL
_btnAddProject.addEventListener('click', function () {
  model.AddProjectModalState.isModalOpened = true;
});
