import { setupWorker } from 'msw/browser';
import { commonHandlers } from './handlers/common';

export const worker = setupWorker(...commonHandlers);

export async function enableMock() {
  if (import.meta.env.DEV) {
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
    console.log('[MSW] Mock Service Worker 已启动');
  }
}

export function disableMock() {
  worker.stop();
  console.log('[MSW] Mock Service Worker 已停止');
}
