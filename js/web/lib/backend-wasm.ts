// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {Backend, InferenceSession, SessionHandler} from 'onnxruntime-common';

import {initializeFlags} from './wasm/flags';
import {OnnxruntimeWebAssemblySessionHandler} from './wasm/session-handler';
import {initializeWebAssembly} from './wasm/wasm-factory';

class OnnxruntimeWebAssemblyBackend implements Backend {
  async init(): Promise<void> {
    // populate wasm flags
    initializeFlags();

    // init wasm
    await initializeWebAssembly();
  }
  createSessionHandler(path: string, options?: InferenceSession.SessionOptions): Promise<SessionHandler>;
  createSessionHandler(buffer: Uint8Array, options?: InferenceSession.SessionOptions): Promise<SessionHandler>;
  async createSessionHandler(pathOrBuffer: string|Uint8Array, _options?: InferenceSession.SessionOptions):
      Promise<SessionHandler> {
    let buffer: Uint8Array;
    if (typeof pathOrBuffer === 'string') {
      const response = await fetch(pathOrBuffer);
      const arrayBuffer = await response.arrayBuffer();
      buffer = new Uint8Array(arrayBuffer);
    } else {
      buffer = pathOrBuffer;
    }
    const handler = new OnnxruntimeWebAssemblySessionHandler();
    // TODO: support SessionOptions
    handler.loadModel(buffer);
    return Promise.resolve(handler);
  }
}

export const wasmBackend = new OnnxruntimeWebAssemblyBackend();
