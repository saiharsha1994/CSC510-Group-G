import template from './videoPlayer.html';
import controller from './video.controller.js'
import './video.component.scss';

const videoComponent = {
    bindings: {
        isVideoCompleted: '=?',
        videosList: '=?'
    },
  template,
    controller,
    controllerAs: 'vm'
};

export default videoComponent;