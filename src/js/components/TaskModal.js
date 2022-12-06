import * as model from '../model';

export default superclass =>
  class extends superclass {
    _generateProjectsList() {
      const { id } = model.state.activeProject;

      return [model.state.inbox, ...model.state.projects]
        .map(
          project =>
            // not very robust cause the edited task (not now, but theoretically)
            // can belong to a project that is not active
            `<option ${project.id === id ? 'selected' : ''}
           value="${project.id}">${project.title}</option>`
        )
        .join('');
    }

    _getSelectedProject() {
      const id = this._parentElement.querySelector('[name=project]').value;
      return [model.state.inbox, ...model.state.projects].find(
        project => project.id === id
      );
    }

    _sortTasks() {
      const project = this._getSelectedProject();
      project.tasks.sort(project.sortingMethod.body);
    }
  };
