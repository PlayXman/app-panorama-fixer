export class GPano {
  UsePanoramaViewer: 'False' | 'True' | string = '';
  ProjectionType: 'cylindrical' | 'spherical' | string = '';
  FullPanoWidthPixels: number = 0;
  FullPanoHeightPixels: number = 0;
  CroppedAreaImageWidthPixels: number = 0;
  CroppedAreaImageHeightPixels: number = 0;
  CroppedAreaLeftPixels: number = 0;
  CroppedAreaTopPixels: number = 0;

  constructor(gPano?: GPano) {
    if (gPano) {
      Object.assign(this, gPano);
    }
  }

  clone(): GPano {
    return new GPano(this);
  }
}
