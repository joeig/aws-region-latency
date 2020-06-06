/* eslint import/no-unassigned-import: 'off' */
import './assets/index.css';
import { startTest } from './startTest';

const startTestButton = document.querySelector('#start-test') as HTMLElement;
startTestButton.addEventListener('click', startTest);
