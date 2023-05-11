import * as model from '../model';

export default superclass =>
  class extends superclass {
    _generateProjectsList() {
      const { id } = model.state.activeProject;

      return model
        .getProjectsWithOwnTasks()
        .map(
          project =>
            //! not very robust cause the edited task (not now, but theoretically) can belong to a project that is not active
            `<option ${
              (project.id === model.TaskControls.state.task.projectId &&
                this._modalType === 'edit') ||
              (project.id === id && this._modalType === 'add')
                ? 'selected'
                : ''
            }
           value="${project.id}">${project.title}</option>`
        )
        .join('');
    }
  };
