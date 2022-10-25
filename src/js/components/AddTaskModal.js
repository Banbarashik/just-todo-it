import { store, component } from 'reefjs';
import * as model from '../model';

const state = store(
  {
    isModalOpened: false,
  },
  'add-task-modal'
);

function _template() {
  if (!state.isModalOpened) return '';

  return `
    <h3>Add a task</h3>
    <form class="add-task-form">
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
      <select>${_generateProjectsList()}</select>
      <button type="button" class="btn--close-modal">Cancel</button>
      <button type="submit" data-mode="add">Add</button>
    </form>
  `;

  function _generateProjectsList() {
    return model.state.projects
      .map(project => `<option value="${project.id}">${project.title}</option>`)
      .join('');
  }
}

component('.add-task-modal', _template, { stores: ['add-task-modal'] });

// EVENT LISTENERS

// CLOSE THE 'ADD A TASK' MODAL
document.addEventListener('click', function (e) {
  const btnCloseModal = e.target.closest('.btn--close-modal');
  if (!btnCloseModal) return;

  state.isModalOpened = false;
});

// ADD A TASK
document.addEventListener('submit', function (e) {
  const form = e.target;
  if (!form.classList.contains('add-task-form')) return;
  e.preventDefault();

  const dataArr = [...new FormData(form)];
  const data = Object.fromEntries(dataArr);

  // model.addProject(data);

  state.isModalOpened = false;
});

export default state;
