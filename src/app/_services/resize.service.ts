import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResizeService {

  resizeImage(file: any, maxheight: number, maxwidth: number, Blob: boolean) {
    return this.resizer(file, maxheight, maxwidth)
    .then(urlString => {
        if(Blob) {
            return this.b64toBlob(urlString);
        } else {
            return urlString;
        }
    });
  }

  private resizer(file: any, maxH: number, maxW: number) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx1 = canvas.getContext('2d');

      const img = document.createElement('img');
      let URLi;

      img.onload = function() {    
        setTimeout(() => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx1.drawImage(img, 0, 0);
          const scale = Math.min((maxW / img.width), (maxH / img.height));
          const iwScaled = img.width * scale;
          const ihScaled = img.height * scale;

          const width_source = canvas.width;
          const height_source = canvas.height;
          const width = Math.round(iwScaled);
          const height = Math.round(ihScaled);

          const ratio_w = width_source / width;
          const ratio_h = height_source / height;
          const ratio_w_half = Math.ceil(ratio_w / 2);
          const ratio_h_half = Math.ceil(ratio_h / 2);

          const ctx = canvas.getContext("2d");
          const imgold = ctx.getImageData(0, 0, width_source, height_source);
          const img2 = ctx.createImageData(width, height);
          const data = imgold.data;
          const data2 = img2.data;

          for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
              let x2 = (i + j * width) * 4;
                let weight = 0;
                let weights = 0;
                let weights_alpha = 0;
                let gx_r = 0;
                let gx_g = 0;
                let gx_b = 0;
                let gx_a = 0;
                let center_y = (j + 0.5) * ratio_h;
                let yy_start = Math.floor(j * ratio_h);
                let yy_stop = Math.ceil((j + 1) * ratio_h);
                for (let yy = yy_start; yy < yy_stop; yy++) {
                    const dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                    const center_x = (i + 0.5) * ratio_w;
                    const w0 = dy * dy; //pre-calc part of w
                    const xx_start = Math.floor(i * ratio_w);
                    const xx_stop = Math.ceil((i + 1) * ratio_w);
                    for (let xx = xx_start; xx < xx_stop; xx++) {
                        const dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                        const w = Math.sqrt(w0 + dx * dx);
                        if (w >= 1) {
                            //pixel too far
                            continue;
                        }
                        //hermite filter
                        weight = 2 * w * w * w - 3 * w * w + 1;
                        const pos_x = 4 * (xx + yy * width_source);
                        //alpha
                        gx_a += weight * data[pos_x + 3];
                        weights_alpha += weight;
                        //colors
                        if (data[pos_x + 3] < 255)
                            weight = weight * data[pos_x + 3] / 250;
                        gx_r += weight * data[pos_x];
                        gx_g += weight * data[pos_x + 1];
                        gx_b += weight * data[pos_x + 2];
                        weights += weight;
                    }
                }
                data2[x2] = gx_r / weights;
                data2[x2 + 1] = gx_g / weights;
                data2[x2 + 2] = gx_b / weights;
                data2[x2 + 3] = gx_a / weights_alpha;
              }
            }
            canvas.width = width;
            canvas.height = height;

            //draw
            ctx.putImageData(img2, 0, 0);
            //https://stackoverflow.com/questions/18922880/html5-canvas-resize-downscale-image-high-quality
            URLi = canvas.toDataURL();        
            return resolve(URLi)
        }, 10);
      }
      return img.src = URL.createObjectURL(file);
    });


    //https://stackoverflow.com/questions/43809120/resizing-a-image-with-javascript-without-rendering-a-canvas-on-the-dom
  }



  b64toBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], {type: mimeString});
    blob['lastModified'] = '';
    blob['name'] = 'resized';
    blob['lastModifiedDate'] = '';
    return blob;
    //https://stackoverflow.com/questions/12168909/blob-from-dataurl
  }

}
