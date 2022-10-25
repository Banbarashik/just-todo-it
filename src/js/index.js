import '../sass/main.scss';
import * as model from './model';
import './components/AddProject';
import './components/AddProjectModal';
import './components/EditProjectModal';
import './components/Project';
import './components/ProjectControls';
import './components/ProjectsList';
import './components/AddTask';
import './components/AddTaskModal';

// EVENT LISTENERS

// OPEN THE 'ADD A TASK' MODAL
document.addEventListener('click', function (e) {
  const btn1 = e.target.closest('.btn--add-task');
  const btn2 = e.target.closest('.project__btn--add-task');

  if (btn1 || btn2) model.AddTaskModalState.isModalOpened = true;
});
