import { store, component } from 'reefjs';

const ProjectComponent = (function () {
  const state = store({
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
    activeProject: {
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
  });

  function template() {
    return `
      <div class="project">
        <p class="project__title">Title: ${state.activeProject.title}</p>
        <p class="project__description">Description: ${
          state.activeProject.description
        }</p>
        <p class="project__due-date">Due date: ${
          state.activeProject.dueDate
            ? state.activeProject.dueDate
            : 'No due date'
        }</p>
        <p>TASKS:</p>
        <ul class="tasks">
          ${_generateTasksMarkup(state.activeProject.tasks)}
        </ul>
        <button class="project__btn--edit">Edit project</button>
        <button class="project__btn--delete">Delete project</button>
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

  component('#app', template);
})();
