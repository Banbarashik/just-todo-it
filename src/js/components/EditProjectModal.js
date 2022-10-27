import { store, component } from 'reefjs';
import * as model from '../model';

const _parentElement = document.querySelector('.edit-project-modal');

const state = store(
  {
    isModalOpened: false,
  },
  'edit-project-modal'
);

function _template() {
  if (!state.isModalOpened) return '';

  return `
    <h3>Edit project</h3>
    <form class="edit-project-form">
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
      <button type="submit">Save</button>
    </form>
  `;
}

component(_parentElement, _template, { stores: ['edit-project-modal'] });

// EVENT LISTENERS

// CLOSE THE MODAL
_parentElement.addEventListener('click', function (e) {
  const btnCloseModal = e.target.closest('.btn--close-modal');
  if (!btnCloseModal) return;

  state.isModalOpened = false;
});

// FILL INPUTS
_parentElement.addEventListener('reef:render', function () {
  const form = document.querySelector('.edit-project-form');

  if (!form) return;

  const inputTitle = form.querySelector('[name="title"]');
  const inputDescription = form.querySelector('[name="description"]');
  const inputDate = form.querySelector('[name="dueDate"]');

  const { title, description, dueDate } = model.ProjectControlsState.project;

  inputTitle.value = title;
  inputDescription.value = description;
  inputDate.value = dueDate;
});

// SAVE CHANGES
_parentElement.addEventListener('submit', function (e) {
  const form = e.target;
  if (!form.classList.contains('edit-project-form')) return;
  e.preventDefault();

  const dataArr = [...new FormData(form)];
  const data = Object.fromEntries(dataArr);

  model.editProject(model.ProjectControlsState.project, data);

  state.isModalOpened = false;
});

export default state;
