import { component } from 'reefjs';
import * as model from '../model';

const _parentElement = document.querySelector('.btn--add-project');

function _template() {
  return '+';
}

component(_parentElement, _template);

// EVENT LISTENERS

// OPEN THE 'ADD A PROJECT' MODAL
_parentElement.addEventListener('click', () =>
  model.AddProjectModal.openModal()
);
