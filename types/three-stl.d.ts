declare module 'three/examples/jsm/loaders/STLLoader' {
  import { Loader, LoadingManager, BufferGeometry } from 'three';

  export class STLLoader extends Loader {
    constructor(manager?: LoadingManager);
    load(
      url: string,
      onLoad: (geometry: BufferGeometry) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void
    ): void;
    loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<BufferGeometry>;
    parse(data: ArrayBuffer | string): BufferGeometry;
  }
}
