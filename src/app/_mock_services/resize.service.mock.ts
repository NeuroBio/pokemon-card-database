import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResizeServiceMock {

  resizeandPreviewImage(event: any, maxHeight: number, maxWidth: number)
    : Promise<{ urlString: string, imageBlob: Blob }> {
        return new Promise(resolve => resolve({
            urlString: 'test-url-string',
            imageBlob: new Blob() }))
  }

  b64toBlob(dataURI): Blob {
   return new Blob();
  }

}
