import Exifr from "exifr";
import {GPano} from "~/utils/GPano";
import {XMLBuilder, XMLParser} from "fast-xml-parser";
import {getMimeType, writeXMP} from "image-metadata-editor";
import {ImageSize} from "~/utils/ImageSize";

/**
 * Parse the GPano XMP metadata of a file.
 * @param {File} file
 * @return {Promise<{xmpXml: any; gPano: GPano}>}
 */
export async function parseGPanoXmp(file) {
  // Supports only JPEG files.
  if (await getMimeType(file) !== 'image/jpeg') {
    throw new Error('Not a JPEG file');
  }

  const allOriginalMetadata = await Exifr.parse(file, {
    xmp: {
      parse: false
    },
    multiSegment: true,
  })
  const originalXmp = allOriginalMetadata.xmp;

  // Requires at least some XMP before proceeding. This can be easily improved if needed.
  if (originalXmp == null) {
    throw new Error('No XMP metadata found');
  }

  // Parse the XMP metadata.
  const xmlParser = new XMLParser();
  const xmpXmlDoc = xmlParser.parse(originalXmp);
  const rdfDescription = xmpXmlDoc?.['x:xmpmeta']?.['rdf:RDF']?.['rdf:Description'];

  if(rdfDescription == null) {
    throw new Error('XMP metadata is not in the expected format');
  }

  const gPano = rdfDescription.find((item) => {
    return Object.keys(item).some((key) => key.startsWith('GPano:'));
  }) ?? {};

  // Create result.
  const currentGPano = new GPano();
  currentGPano.UsePanoramaViewer = gPano['GPano:UsePanoramaViewer'] ?? '';
  currentGPano.ProjectionType = gPano['GPano:ProjectionType'] ?? '';
  currentGPano.FullPanoWidthPixels = gPano['GPano:FullPanoWidthPixels'] ?? 0;
  currentGPano.FullPanoHeightPixels = gPano['GPano:FullPanoHeightPixels'] ?? 0;
  currentGPano.CroppedAreaImageWidthPixels = gPano['GPano:CroppedAreaImageWidthPixels'] ?? 0;
  currentGPano.CroppedAreaImageHeightPixels = gPano['GPano:CroppedAreaImageHeightPixels'] ?? 0;
  currentGPano.CroppedAreaLeftPixels = gPano['GPano:CroppedAreaLeftPixels'] ?? 0;
  currentGPano.CroppedAreaTopPixels = gPano['GPano:CroppedAreaTopPixels'] ?? 0;

  return {
    xmpXml: xmpXmlDoc,
    gPano: currentGPano
  };
}

/**
 * Return a recommended GPano metadata.
 * @param {ImageSize} imageSize
 * @return {GPano}
 */
export function createRecommendedGPano(imageSize) {
  const result = new GPano();
  result.UsePanoramaViewer = 'True';
  result.ProjectionType = 'cylindrical';
  result.FullPanoWidthPixels = 23800;
  result.FullPanoHeightPixels = 11900;
  result.CroppedAreaImageWidthPixels = imageSize.width;
  result.CroppedAreaImageHeightPixels = imageSize.height;
  result.CroppedAreaLeftPixels = Math.round((23800 - imageSize.width) / 2);
  result.CroppedAreaTopPixels = Math.round((11900 - imageSize.height) / 2);

  return result;
}

/**
 *
 * @param {File} originalFile
 * @param {any} originalXmpXml
 * @param {GPano} nextGPano
 * @return {Promise<File>} New file with updated XMP metadata.
 */
export async function updateGPanoXmp(originalFile, originalXmpXml, nextGPano) {
  let rdfDescription = originalXmpXml?.['x:xmpmeta']?.['rdf:RDF']?.['rdf:Description'];

  if(rdfDescription == null) {
    throw new Error('XMP metadata is not in the expected format');
  }

  let gPano = rdfDescription.find((item) => {
    return Object.keys(item).some((key) => key.startsWith('GPano:'));
  });

  if (gPano == null) {
    gPano = {};
    rdfDescription.push(gPano);
  }

  // Set next values.
  gPano['GPano:UsePanoramaViewer'] = nextGPano.UsePanoramaViewer;
  gPano['GPano:ProjectionType'] = nextGPano.ProjectionType;
  gPano['GPano:FullPanoWidthPixels'] = nextGPano.FullPanoWidthPixels;
  gPano['GPano:FullPanoHeightPixels'] = nextGPano.FullPanoHeightPixels;
  gPano['GPano:CroppedAreaImageWidthPixels'] = nextGPano.CroppedAreaImageWidthPixels;
  gPano['GPano:CroppedAreaImageHeightPixels'] = nextGPano.CroppedAreaImageHeightPixels;
  gPano['GPano:CroppedAreaLeftPixels'] = nextGPano.CroppedAreaLeftPixels;
  gPano['GPano:CroppedAreaTopPixels'] = nextGPano.CroppedAreaTopPixels;

  const xmlBuilder = new XMLBuilder();
  const nextXmp = xmlBuilder.build(originalXmpXml);

  // Generate new file.
  const uint8Array = await writeXMP(originalFile, nextXmp);
  const filename = `${originalFile.name.split('.')[0]}-p.jpg`
  return new File([uint8Array], filename, {type: 'image/jpeg'})
}
