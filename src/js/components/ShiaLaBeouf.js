import { component } from '../../../node_modules/reefjs/src/reef';
import shiaLaBeoufPhoto from '../../img/shia_la_beouf.png';
import { importAll, getRandomArrItem } from '../helper';

const soundsSource = importAll(require.context('../../sounds/', false));
const sounds = soundsSource.map(sound => new Audio(sound));

class ShiaLaBeouf {
  _parentElement = document.querySelector('.shia-la-beouf');

  constructor() {
    this._addHandlerPlaySound(this._playSound);

    component(this._parentElement, this._template);
  }

  _template() {
    return `<img src="${shiaLaBeoufPhoto}" />`;
  }

  _playSound() {
    if (sounds.some(sound => !sound.paused)) return;

    const audio = getRandomArrItem(sounds);
    audio.play();
  }

  _addHandlerPlaySound(handler) {
    this._parentElement.addEventListener('click', handler);
  }
}

new ShiaLaBeouf();
