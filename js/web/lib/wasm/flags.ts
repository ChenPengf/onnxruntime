import {env} from 'onnxruntime-common';

/**
 * This function initializes flags for WebAssembly.
 *
 * Those flags are accessible from `ort.env.wasm`. Users are allow to set those flags before the first inference session
 * being created, to override default value.
 */
export const initializeFlags = (): void => {
  if (typeof env.wasm.initTimeout !== 'number' || env.wasm.initTimeout < 0) {
    env.wasm.initTimeout = 0;
  }

  if (typeof env.wasm.worker !== 'number' || !Number.isInteger(env.wasm.worker) || env.wasm.worker < 0) {
    env.wasm.worker = Math.max(1, (navigator.hardwareConcurrency || 1) / 2);
  }
  env.wasm.worker = Math.min(4, env.wasm.worker);
};
