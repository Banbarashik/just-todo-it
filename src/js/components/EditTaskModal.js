import { store, component } from 'reefjs';
import * as model from '../model';

const _parentElement = document.querySelector('.edit-task-modal');

const state = store(
  {
    isModalOpened: false,
  },
  'edit-task-modal'
);

function _template() {
  if (!state.isModalOpened) return '';

  return `
    <h3>Edit task</h3>
    <form class="edit-task-form">
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
      <select name="project">${_generateProjectsList()}</select>
      <button type="button" class="btn--close-modal">Cancel</button>
      <button type="submit">Save</button>
    </form>
  `;

  function _generateProjectsList() {
    const { id } = model.state.activeProject;

    return model.state.projects
      .map(
        project =>
          // not very robust cause the edited task (not now, but theoretically)
          // can belong to a project that is not active
          `<option ${project.id === id ? 'selected' : ''}
           value="${project.id}">${project.title}</option>`
      )
      .join('');
  }
}

component(_parentElement, _template, { stores: ['edit-task-modal'] });

// EVENT LISTENERS

// CLOSE THE MODAL
_parentElement.addEventListener('click', function (e) {
  const btnCloseModal = e.target.closest('.btn--close-modal');
  if (!btnCloseModal) return;

  state.isModalOpened = false;
});

// FILL INPUTS
_parentElement.addEventListener('reef:render', function () {
  const form = document.querySelector('.edit-task-form');

  if (!form) return;

  const inputTitle = form.querySelector('[name="title"]');
  const inputDescription = form.querySelector('[name="description"]');
  const inputDate = form.querySelector('[name="dueDate"]');

  const { title, description, dueDate } = model.TaskControlsState.task;

  inputTitle.value = title;
  inputDescription.value = description;
  inputDate.value = dueDate;
});

// SAVE CHANGES
_parentElement.addEventListener('submit', function (e) {
  const form = e.target;
  if (!form.classList.contains('edit-task-form')) return;
  e.preventDefault();

  const dataArr = [...new FormData(form)];
  const data = Object.fromEntries(dataArr);

  model.editTask(
    model.TaskControlsState.task,
    model.TaskControlsState.project,
    data
  );

  state.isModalOpened = false;
});

export default state;
