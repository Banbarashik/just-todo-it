import { component } from 'reefjs';

const _parentElement = document.querySelector('.btn--add-task');

function _template() {
  return '+';
}

component(_parentElement, _template);
