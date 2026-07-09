import { setupWorker } from 'msw/browser';
import { gestionTokenHandlers } from './handlers';

export const worker = setupWorker(...gestionTokenHandlers);
