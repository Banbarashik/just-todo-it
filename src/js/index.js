import '../sass/main.scss';

import { store, component } from 'reefjs';

// MODEL

const globalState = store({
  projects: [
    {
      id: '1',
      title: 'Test',
      description: 'A test project',
      dueDate: null,
      tasks: [
        {
          id: '11',
          title: 'Stronglifts',
          description: 'Complete a set of exercises',
          dueDate: null,
        },
      ],
    },
  ],
  activeProject: {},
});

function addProject(formData) {
  const { title, description, dueDate } = formData;

  const project = {
    id: Date.now().toString(),
    title,
    description,
    dueDate,
    tasks: [],
  };

  globalState.projects.push(project);
  globalState.activeProject = project;

  // Change ID in URL (doesn't invoke the 'hashchange' event)
  window.history.pushState(null, '', `#${project.id}`);
}

function editProject(project, formData) {
  for (let prop in formData) {
    if (formData[prop] === project[prop]) continue;

    project[prop] = formData[prop];
  }
}

function setProjectAsActive(id) {
  globalState.activeProject = globalState.projects.find(
    project => project.id === id
  );
}

// COMPONENTS

const ProjectComponent = (function () {
  function template() {
    if (!Object.keys(globalState.activeProject).length) return '';

    return `
      <div class="project" data-id="${globalState.activeProject.id}">
        <p class="project__title">Title: ${globalState.activeProject.title}</p>
        <p class="project__description">Description: ${
          globalState.activeProject.description
        }</p>
        <p class="project__due-date">Due date: ${
          globalState.activeProject.dueDate
            ? globalState.activeProject.dueDate
            : 'No due date'
        }</p>
        <p>TASKS:</p>
        <ul class="tasks">
          ${_generateTasksMarkup(globalState.activeProject.tasks)}
        </ul>
        <button class="btn--project-controls">...</button>
        <button class="project__btn--add-task">Add task</button>
      </div>
    `;
  }

  function _generateTasksMarkup(tasks) {
    return tasks
      .map(function (task) {
        return `
          <li class="task" data-id="task-${task.id}">
            <p class="task__title">Title: ${task.title}</p>
            <p class="task__description">Description: ${task.description}</p>
            <p class="task__due-date">Due date: ${
              task.dueDate ? task.dueDate : 'No due date'
            }</p>
            <button class="task__btn--edit">Edit task</button>
          </li>
        `;
      })
      .join('');
  }

  component('.project-window', template);

  // EVENT LISTENERS

  // Set the project as active (i.e., render it)
  ['hashchange', 'load'].forEach(ev =>
    window.addEventListener(ev, function (e) {
      const id = window.location.hash.slice(1);
      if (!id) return;
      setProjectAsActive(id);
    })
  );
})();

const ProjectControlsComponent = (function () {
  // STATE

  const state = store(
    {
      areProjectControlsOpened: false,
      targetProjectId: null,
    },
    'project-controls'
  );

  function template() {
    if (!state.areProjectControlsOpened) return '';

    return `
      <button class="project__btn--edit">Edit project</button>
      <button class="project__btn--delete">Delete project</button>
    `;
  }

  component('.project-controls', template, { stores: ['project-controls'] });

  // EVENT LISTENERS

  // OPEN PROJECT CONTROLS
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn--project-controls');

    if (!btn) {
      state.areProjectControlsOpened = false;
      return;
    }

    const projectItem = btn.closest('.project-item');
    const project = btn.closest('.project');

    const id = projectItem
      ? projectItem.dataset.id
      : project
      ? project.dataset.id
      : null;

    state.areProjectControlsOpened = true;
    state.targetProjectId = id;
  });

  // DELETE A PROJECT
  document.addEventListener('click', function (e) {
    const btnDeleteProject = e.target.closest('.project__btn--delete');
    if (!btnDeleteProject) return;

    const index = globalState.projects.findIndex(
      projet => projet.id === state.targetProjectId
    );

    // if the project is active - reset the active project
    if (globalState.activeProject.id === state.targetProjectId)
      globalState.activeProject = {};

    globalState.projects.splice(index, 1);
  });

  // OPEN THE 'EDIT A PROJECT' MODAL
  // TODO: the 'fill inputs' function should be executed after the modal was rendered,
  // that is, after the state has been updated
  // one of the variants is to listen for the required store event ('reef:store-edit-project-modal'), and only then fill the inputs
  document.addEventListener('click', function (e) {
    const btnEditModal = e.target.closest('.project__btn--edit');
    if (!btnEditModal) return;

    EditProjectModalComponent.state.isModalOpened = true;

    /* const form = document.querySelector('.edit-project-form');
    const inputTitle = form.querySelector('[name="title"]');
    const inputDescription = form.querySelector('[name="description"]');
    const inputDate = form.querySelector('[name="dueDate"]');

    const projectToEdit = globalState.projects.find(
      projet => projet.id === state.targetProjectId
    );

    const { title, description, dueDate } = projectToEdit;

    inputTitle.value = title;
    inputDescription.value = description;
    inputDate.value = dueDate;
 */
  });

  return { state };
})();

const ProjectsListComponent = (function () {
  function template() {
    return globalState.projects
      .map(function (project) {
        return `
          <li data-id="${project.id}" class="project-item">
            <a href="#${project.id}"
            class="project-item--link ${
              project.id === globalState.activeProject.id
                ? 'project-item--active'
                : ''
            }" >
              <span>${project.title}</span>
              </a>
            <button class="btn--project-controls">...</button>
          </li>
        `;
      })
      .join('');
  }

  component('.projects-list', template);
})();

const AddProjectComponent = (function () {
  const btnAddProject = document.querySelector('.btn--add-project');

  function template() {
    return '+';
  }

  component(btnAddProject, template);

  // EVENT LISTENERS

  // OPEN THE 'ADD PROJECT' MODAL
  btnAddProject.addEventListener('click', function () {
    AddProjectModalComponent.state.isModalOpened = true;
  });
})();

const AddProjectModalComponent = (function () {
  // MODEL
  const state = store(
    {
      isModalOpened: false,
    },
    'add-project-modal'
  );

  function template() {
    if (!state.isModalOpened) return '';

    return `
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

  component('.add-project-modal', template, { stores: ['add-project-modal'] });

  // EVENT LISTENERS

  // CLOSE THE 'ADD PROJECT' MODAL
  document.addEventListener('click', function (e) {
    const btnCloseModal = e.target.closest('.btn--close-modal');
    if (!btnCloseModal) return;

    state.isModalOpened = false;
  });

  // ADD A PROJECT
  document.addEventListener('submit', function (e) {
    const addProjectForm = e.target;
    if (!addProjectForm.classList.contains('add-project-form')) return;
    e.preventDefault();

    const dataArr = [...new FormData(addProjectForm)];
    const data = Object.fromEntries(dataArr);

    addProject(data);

    state.isModalOpened = false;
  });
  return { state };
})();

const EditProjectModalComponent = (function () {
  const editProjectModal = document.querySelector('.edit-project-modal');

  // MODEL

  const state = store(
    {
      isModalOpened: false,
    },
    'edit-project-modal'
  );

  function template() {
    if (!state.isModalOpened) return '';

    return `
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

  component(editProjectModal, template, { stores: ['edit-project-modal'] });

  // EVENT LISTENERS

  // CLOSE THE MODAL
  document.addEventListener('click', function (e) {
    const btnCloseModal = e.target.closest('.btn--close-modal');
    if (!btnCloseModal) return;

    state.isModalOpened = false;
  });

  // FILL INPUTS
  editProjectModal.addEventListener('reef:render', function (e) {
    const form = document.querySelector('.edit-project-form');

    if (!form) return;

    const inputTitle = form.querySelector('[name="title"]');
    const inputDescription = form.querySelector('[name="description"]');
    const inputDate = form.querySelector('[name="dueDate"]');

    const projectToEdit = globalState.projects.find(
      projet => projet.id === ProjectControlsComponent.state.targetProjectId
    );

    const { title, description, dueDate } = projectToEdit;

    inputTitle.value = title;
    inputDescription.value = description;
    inputDate.value = dueDate;
  });

  // SAVE CHANGES
  editProjectModal.addEventListener('submit', function (e) {
    const form = e.target;
    if (!form.classList.contains('edit-project-form')) return;
    e.preventDefault();

    const dataArr = [...new FormData(form)];
    const data = Object.fromEntries(dataArr);

    const projectToEdit = globalState.projects.find(
      projet => projet.id === ProjectControlsComponent.state.targetProjectId
    );

    editProject(projectToEdit, data);

    state.isModalOpened = false;
  });

  return { state };
})();
