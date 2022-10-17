import '../sass/main.scss';

import { store, component, render } from 'reefjs';

// MODEL

const globalState = store({
  projects: [
    {
      id: 1,
      title: 'Test',
      description: 'A test project',
      dueDate: null,
      tasks: [
        {
          id: 11,
          title: 'Stronglifts',
          description: 'Complete a set of exercises',
          dueDate: null,
        },
      ],
    },
  ],
  activeProject: {},
});

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
      <div class="project">
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
          <li class="task" data-task-id="${task.id}">
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
})();

const ProjectControlsComponent = (function () {
  const state = store(
    {
      areProjectControlsOpened: false,
    },
    'project-controls'
  );

  function template() {
    if (!state.areProjectControlsOpened) return '';

    return `
      <button class="project__btn--edit">Edit project</button>
      <button class="project__btn--delete">Delete project</button>
      <button class="project__btn--add-task">Add task</button>
    `;
  }

  component('.project-controls', template, { stores: ['project-controls'] });

  return { state };
})();

const ProjectsListComponent = (function () {
  function template() {
    return globalState.projects
      .map(function (project) {
        return `
          <li data-id="${project.id}" class="project-item">
            <span>${project.title}</span>
            <button class="btn--project-controls">...</button>
          </li>
        `;
      })
      .join('');
  }

  component('.projects-list', template);

  // EVENT LISTENERS

  // SET PROJECT AS ACTIVE (RENDER IT)
  document.addEventListener('click', function (e) {
    const projectItem = e.target.closest('.project-item');
    if (!projectItem) return;

    const { id } = projectItem.dataset;

    setProjectAsActive(+id);
  });
})();

const BtnOpenAddProjectModalComponent = (function () {
  const btnAddProject = document.querySelector('.btn--add-project');

  function template() {
    return '+';
  }

  component(btnAddProject, template);

  // EVENT LISTENERS

  // OPEN THE 'ADD PROJECT' MODAL
  btnAddProject.addEventListener('click', function () {
    AddProjectModalComponent.state.isProjectOpened = true;
  });
})();

const AddProjectModalComponent = (function () {
  // MODEL
  const state = store(
    {
      isProjectOpened: false,
    },
    'add-project-modal'
  );

  function template() {
    if (!state.isProjectOpened) return '';

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
        <button type="submit" data-mode="add">Add</button>
      </form>
    `;
  }

  component('.edit-project-modal', template, { stores: ['add-project-modal'] });

  // EVENT LISTENERS

  // CLOSE THE 'ADD PROJECT' MODAL
  document.addEventListener('click', function (e) {
    const closeModalBtn = e.target.closest('.btn--close-modal');
    if (!closeModalBtn) return;

    state.isProjectOpened = false;
  });

  return { state };
})();

// EVENT LISTENERS

// OPEN PROJECT CONTROLS
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.btn--project-controls');
  if (btn) ProjectControlsComponent.state.areProjectControlsOpened = true;
  else ProjectControlsComponent.state.areProjectControlsOpened = false;
});
