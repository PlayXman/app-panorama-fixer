import {GPano} from "~/utils/GPano";

export const PANORAMA_METADATA_NAME_PREFIX = 'GPano';

export class XmpXml {
  fullXmpXml: Record<string, any>;
  rdfDescription: Record<string, any> | Record<string, any>[] | null;
  gPano: Record<string, any>;

  constructor(originalXmpXml: any) {
    this.fullXmpXml = originalXmpXml;
    this.rdfDescription = originalXmpXml?.['x:xmpmeta']?.['rdf:RDF']?.['rdf:Description'] ?? null;

    if(this.rdfDescription == null) {
      throw new Error('XMP metadata is not in the expected format');
    }

    if(this.isRdfDescriptionList) {
      const rdfDescription = this.rdfDescription as Record<string, any>[];
      let gPano = rdfDescription.find(item => {
        return Object.keys(item).some(key => key.startsWith(PANORAMA_METADATA_NAME_PREFIX));
      });

      if(gPano == null) {
        gPano = {};
        rdfDescription.push(gPano);
      }

      this.gPano = gPano;
    } else {
      this.gPano = this.rdfDescription;
    }
  }

  get isRdfDescriptionList(): boolean {
    return Array.isArray(this.rdfDescription);
  }

  toGPano(): GPano {
    const result = new GPano();
    result.UsePanoramaViewer = this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:UsePanoramaViewer`] ?? '';
    result.ProjectionType = this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:ProjectionType`] ?? '';
    result.FullPanoWidthPixels = this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:FullPanoWidthPixels`] ?? 0;
    result.FullPanoHeightPixels = this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:FullPanoHeightPixels`] ?? 0;
    result.CroppedAreaImageWidthPixels = this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:CroppedAreaImageWidthPixels`] ?? 0;
    result.CroppedAreaImageHeightPixels = this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:CroppedAreaImageHeightPixels`] ?? 0;
    result.CroppedAreaLeftPixels = this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:CroppedAreaLeftPixels`] ?? 0;
    result.CroppedAreaTopPixels = this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:CroppedAreaTopPixels`] ?? 0;

    return result;
  }

  setGPano(gPano: GPano): void {
    this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:UsePanoramaViewer`] = gPano.UsePanoramaViewer;
    this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:ProjectionType`] = gPano.ProjectionType;
    this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:FullPanoWidthPixels`] = gPano.FullPanoWidthPixels;
    this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:FullPanoHeightPixels`] = gPano.FullPanoHeightPixels;
    this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:CroppedAreaImageWidthPixels`] = gPano.CroppedAreaImageWidthPixels;
    this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:CroppedAreaImageHeightPixels`] = gPano.CroppedAreaImageHeightPixels;
    this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:CroppedAreaLeftPixels`] = gPano.CroppedAreaLeftPixels;
    this.gPano[`${PANORAMA_METADATA_NAME_PREFIX}:CroppedAreaTopPixels`] = gPano.CroppedAreaTopPixels;
  }
}
