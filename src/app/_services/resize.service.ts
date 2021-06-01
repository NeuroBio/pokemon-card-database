import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  resizeandPreviewImage(event: any, maxHeight: number, maxWidth: number)
    : Promise<{ urlString: string, imageBlob: Blob }> {
      return this.resizer(event.target.files[0], maxHeight, maxWidth)
      .then((urlString: string) => {
        const imageBlob = this.b64toBlob(urlString);
        return { urlString, imageBlob };
      });
  }

  // resizeImage(file: any, maxheight: number, maxwidth: number, Blob: boolean) {
  //   return this.resizer(file, maxheight, maxwidth)
  //   .then(urlString => {
  //       if (Blob) {
  //           return this.b64toBlob(urlString);
  //       } else {
  //           return urlString;
  //       }
  //   });
  // }

  private resizer(file: any, maxH: number, maxW: number): Promise<unknown> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx1 = canvas.getContext('2d');

      const img = document.createElement('img');
      let URLi;

      img.onload = () => {
        setTimeout(() => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx1.drawImage(img, 0, 0);
          const scale = Math.min((maxW / img.width), (maxH / img.height));
          const iwScaled = img.width * scale;
          const ihScaled = img.height * scale;

          const widthSource = canvas.width;
          const heightSource = canvas.height;
          const width = Math.round(iwScaled);
          const height = Math.round(ihScaled);

          const ratioW = widthSource / width;
          const ratioH = heightSource / height;
          const ratioWHalf = Math.ceil(ratioW / 2);
          const ratioHHalf = Math.ceil(ratioH / 2);

          const ctx = canvas.getContext('2d');
          const imgold = ctx.getImageData(0, 0, widthSource, heightSource);
          const img2 = ctx.createImageData(width, height);
          const data = imgold.data;
          const data2 = img2.data;

          for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
              const x2 = (i + j * width) * 4;
              let weight = 0;
              let weights = 0;
              let weightsAlpha = 0;
              let gxR = 0;
              let gxG = 0;
              let gxB = 0;
              let gxA = 0;
              const centerY = (j + 0.5) * ratioH;
              const yyStart = Math.floor(j * ratioH);
              const yyStop = Math.ceil((j + 1) * ratioH);
              for (let yy = yyStart; yy < yyStop; yy++) {
                const dy = Math.abs(centerY - (yy + 0.5)) / ratioHHalf;
                const centerX = (i + 0.5) * ratioW;
                const w0 = dy * dy; // pre-calc part of w
                const xxStart = Math.floor(i * ratioW);
                const xxStop = Math.ceil((i + 1) * ratioW);
                for (let xx = xxStart; xx < xxStop; xx++) {
                  const dx = Math.abs(centerX - (xx + 0.5)) / ratioWHalf;
                  const w = Math.sqrt(w0 + dx * dx);
                  if (w >= 1) {
                    // pixel too far
                    continue;
                  }
                  // hermite filter
                  weight = 2 * w * w * w - 3 * w * w + 1;
                  const posX = 4 * (xx + yy * widthSource);
                  // alpha
                  gxA += weight * data[posX + 3];
                  weightsAlpha += weight;
                  // colors
                  if (data[posX + 3] < 255) {
                    weight = weight * data[posX + 3] / 250;
                  }
                  gxR += weight * data[posX];
                  gxG += weight * data[posX + 1];
                  gxB += weight * data[posX + 2];
                  weights += weight;
                }
              }
              data2[x2] = gxR / weights;
              data2[x2 + 1] = gxG / weights;
              data2[x2 + 2] = gxB / weights;
              data2[x2 + 3] = gxA / weightsAlpha;
            }
          }
          canvas.width = width;
          canvas.height = height;

          // draw
          ctx.putImageData(img2, 0, 0);
          // https://stackoverflow.com/questions/18922880/html5-canvas-resize-downscale-image-high-quality
          URLi = canvas.toDataURL();
          return resolve(URLi);
        }, 10);
      };
      return img.src = URL.createObjectURL(file);
    });


    // https://stackoverflow.com/questions/43809120/resizing-a-image-with-javascript-without-rendering-a-canvas-on-the-dom
  }



  b64toBlob(dataURI): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob: any = new Blob([ab], { type: mimeString });
    blob.lastModified = '';
    blob.name = 'resized';
    blob.lastModifiedDate = '';
    return blob as Blob;
    // https://stackoverflow.com/questions/12168909/blob-from-dataurl
  }

  // filetob64(event: any) {
  //   return new Promise((resolve: any) => {
  //     const File = event.target.files[0];
  //     // TODO: eventually figure out why I can't use filereader as a this level variable
  //     let reader = new FileReader();
  //     reader.onload = function () {
  //       return resolve(reader.result);
  //     };
  //     return reader.readAsDataURL(File);
  //   });
  // }

}
