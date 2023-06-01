import { configureCanvasSize } from './utils/canvas';

import './index.css';


const canvas = document.getElementById("canvas");

if (canvas instanceof HTMLCanvasElement) {
    // TODO fire events to event bus

    configureCanvasSize(canvas);

    window.onresize = () => {
        configureCanvasSize(canvas);
    };
}
