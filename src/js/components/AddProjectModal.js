import { store, component } from 'reefjs';
import * as model from '../model';

const _parentElement = document.querySelector('.add-project-modal');

const state = store(
  {
    isModalOpened: false,
  },
  'add-project-modal'
);

function _template() {
  if (!state.isModalOpened) return '';

  return `
    <h3>Add project</h3>
    <form class="add-project-form">
      <div class="form-field">
        <label>Title</label>
        <input name="title" />
      </div>
      <div class="form-field">
        <label>Description</label>
        <textarea name="description" cols="30" rows="5"></textarea>
      </div>
      <div class="form-field">
        <label>Due date</label>
        <input type="datetime-local" name="dueDate" />
      </div>
      <button type="button" class="btn--close-modal">Cancel</button>
      <button type="submit" data-mode="add">Add</button>
    </form>
  `;
}

component(_parentElement, _template, { stores: ['add-project-modal'] });

// EVENT LISTENERS

// CLOSE THE 'ADD A PROJECT' MODAL
_parentElement.addEventListener('click', function (e) {
  const btnCloseModal = e.target.closest('.btn--close-modal');
  if (!btnCloseModal) return;

  state.isModalOpened = false;
});

// ADD A PROJECT
_parentElement.addEventListener('submit', function (e) {
  const form = e.target;
  if (!form.classList.contains('add-project-form')) return;
  e.preventDefault();

  const dataArr = [...new FormData(form)];
  const data = Object.fromEntries(dataArr);

  model.addProject(data);

  state.isModalOpened = false;
});

export default state;
