import Exifr from "exifr";
import {GPano} from "~/utils/GPano";
import {XMLBuilder, XMLParser} from "fast-xml-parser";
import {getMimeType, writeXMP} from "image-metadata-editor";
import {ImageSize} from "~/utils/ImageSize";
import {XmpXml} from "~/utils/XmpXml";

/**
 * Parse the GPano XMP metadata of a file.
 * @param {File} file
 * @return {Promise<XmpXml>}
 */
export async function extractGPanoXmp(file) {
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
  const xmlParser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });
  const xmpXmlDoc = xmlParser.parse(originalXmp);

  return new XmpXml(xmpXmlDoc);
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
 * Create a new image file with updated XMP metadata.
 * @param {File} originalFile
 * @param {XmpXml} xmpXml
 * @param {GPano} nextGPano GPano with new values.
 * @return {Promise<File>} New file with updated XMP metadata.
 */
export async function updateGPanoXmp(originalFile, xmpXml, nextGPano) {
  xmpXml.setGPano(nextGPano);

  const xmlBuilder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });
  const nextXmpString = xmlBuilder.build(xmpXml.fullXmpXml);

  // Generate new file.
  const uint8Array = await writeXMP(originalFile, nextXmpString);
  const filename = `${originalFile.name.split('.')[0]}-p.jpg`
  return new File([uint8Array], filename, {type: 'image/jpeg'})
}
