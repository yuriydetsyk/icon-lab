import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { Color } from '../../models/enums/color';
import { ColorData } from '../../models/interfaces/color-data';
import { Coordinates } from '../../models/interfaces/coordinates';
import { FilledElementsData } from '../../models/interfaces/filled-elements-data';
import { Sizes } from '../../models/interfaces/sizes';
import { ArrayHelper } from '../../shared/helpers/array.helper';
import { DataHelper } from '../../shared/helpers/data.helper';
import { ImageHelper } from '../../shared/helpers/image.helper';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private iconSvgs = new Map<string, SVGSVGElement>();

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  public getIconSvgs() {
    return this.iconSvgs;
  }

  public getIconSvg(iconId: string) {
    return this.iconSvgs.get(iconId);
  }

  public setIconSvg(iconId: string, body: SVGSVGElement) {
    this.iconSvgs.set(iconId, body.cloneNode(true) as SVGSVGElement);
  }

  public createSvg(svgSize: Sizes) {
    const svg = this.document.createElementNS(ImageHelper.SVG_NAMESPACE, 'svg');
    svg.setAttribute('xmlns', ImageHelper.SVG_NAMESPACE);

    // set width & height values of the SVG
    svg.setAttribute('width', svgSize.width.toString());
    svg.setAttribute('height', svgSize.height.toString());
    svg.setAttribute('viewBox', `0 0 ${svgSize.width} ${svgSize.height}`);

    // TODO: remove temporary image preview
    // this.document.querySelector('.lab-wrapper-preview').appendChild(svg);

    svg.appendChild(this.createDefs()); // add empty defs section

    return svg;
  }

  public createDefs() {
    return this.document.createElementNS(ImageHelper.SVG_NAMESPACE, 'defs');
  }

  public createGroup(settings: {
    coordinates: Coordinates;
    childElement?: SVGSVGElement;
    size?: Sizes;
    rotationAngle?: number;
  }) {
    const { coordinates, childElement, size, rotationAngle } = settings;
    let svgGroup: SVGGElement;
    let transformValue = `translate(${coordinates.x},${coordinates.y})`;

    if (childElement) {
      svgGroup = childElement.querySelector('g').cloneNode(true) as SVGGElement;

      let sizes: Sizes;
      const innerRasterImage = svgGroup.querySelector<SVGImageElement>(`.${ImageHelper.RASTER_IMAGE_CSS_CLASS}`);
      if (innerRasterImage) {
        sizes = {
          width: innerRasterImage.width.baseVal.value,
          height: innerRasterImage.height.baseVal.value,
        };
      } else {
        const viewBox = childElement.viewBox.baseVal;
        sizes = { width: viewBox.width, height: viewBox.height };
      }

      // find the SVG group scaling delta, based on its SVG viewport and a desired size
      const delta: Sizes = {
        width: size.width / sizes.width,
        height: size.height / sizes.height,
      };
      transformValue += ` scale(${delta.width}, ${delta.height})`;

      if (rotationAngle) {
        transformValue += ` rotate(${rotationAngle}, ${size.width / 2}, ${size.height / 2})`;
      }
    } else {
      svgGroup = this.document.createElementNS(ImageHelper.SVG_NAMESPACE, 'g');
    }

    svgGroup.setAttribute('transform', transformValue);

    return svgGroup;
  }

  public createRect(rectSize: Sizes) {
    const rect = this.document.createElementNS(ImageHelper.SVG_NAMESPACE, 'rect');
    rect.setAttribute('width', rectSize.width.toString());
    rect.setAttribute('height', rectSize.height.toString());
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '0');
    rect.style.fill = 'transparent';
    rect.style.stroke = 'black';

    return rect;
  }

  public getSVGString(svgNode: SVGSVGElement) {
    const cssStyleText = this.getCSSStyles(svgNode);
    this.appendCSS(cssStyleText, svgNode);

    let svgString = new XMLSerializer().serializeToString(svgNode);
    svgString = this.addMetadata(svgString);

    return svgString;
  }

  public exportSvg(svg: SVGSVGElement, artboardName: string) {
    if (!artboardName?.length) {
      artboardName = ImageHelper.DEFAULT_ARTBOARD_NAME;
    }

    const svgString = this.getSVGString(svg);
    DataHelper.saveFile(svgString, `${artboardName}.svg`, 'image/svg+xml;charset=utf-8');
  }

  // TODO: improve
  public exportRaster(svg: SVGSVGElement, width: number, height: number, artboardName: string) {
    if (!artboardName?.length) {
      artboardName = ImageHelper.DEFAULT_ARTBOARD_NAME;
    }

    const svgString = this.getSVGString(svg);
    const imgSrc = `data:image/svg+xml;base64,${btoa(svgString)}`; // Convert SVG string to data URL
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    const image = new Image();
    image.onload = () => {
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      canvas.toBlob((blob) => {
        DataHelper.saveFile(blob, `${artboardName}.png`); // TODO: add a dynamic raster image format (PNG / JPG etc.)
      }, `image/png`);
    };
    image.onerror = (e) => {
      console.log(e);
    };
    image.src = imgSrc;
  }

  public addFillGroups(iconSvg: SVGSVGElement) {
    const resultSvg = iconSvg.cloneNode(true) as SVGSVGElement;

    const unprocessedFilledElements = ArrayHelper.groupBy(
      Array.from(resultSvg.querySelectorAll<SVGElement>(`:not([${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}]):not(g)[fill]`)),
      (el) => this.getElementFillColor(el)
    );

    // process grouped filled elements by assigning new group IDs to them
    let groupIndex = 1;
    Object.entries(unprocessedFilledElements).forEach(([color, elements]) => {
      // skip all elements filled with white color, as they should not be edited
      if (color.toLowerCase() === Color.White) {
        return;
      }

      elements.forEach((element) => {
        element.setAttribute(ImageHelper.DOM_ATTRIBUTES.GROUP_ID, groupIndex.toString());
      });
      groupIndex++;
    });

    return resultSvg;
  }

  public getFillData(svgBody: SVGSVGElement) {
    const data: FilledElementsData[] = [];

    const groupedFilledElements = ArrayHelper.groupBy(
      Array.from(svgBody.querySelectorAll<SVGElement>(`[${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}]:not(g)`)),
      (el) => el.getAttribute(ImageHelper.DOM_ATTRIBUTES.GROUP_ID)
    );

    Object.entries(groupedFilledElements).forEach(([index, elements]) => {
      data.push({ index, color: this.getElementFillColor(elements[0]), elements });
    });

    return data;
  }

  public setIconColors(svgBody: SVGSVGElement, colorData: ColorData[]) {
    const groupedFilledElements = ArrayHelper.groupBy(
      Array.from(svgBody.querySelectorAll<SVGElement>(`[${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}]:not(g)`)),
      (el) => el.getAttribute(ImageHelper.DOM_ATTRIBUTES.GROUP_ID)
    );

    // some filled elements may already be grouped -> fetch their existing group IDs
    Object.entries(groupedFilledElements).forEach(([index, elements]) => {
      const colorDataItem = colorData.find((item) => item.index === index);
      if (colorDataItem) {
        elements.forEach((element) => element.setAttribute('fill', colorDataItem.color));
      }
    });
  }

  public getElementFillColor(el: SVGElement) {
    return el.getAttribute('fill') || el.style.fill;
  }

  // TODO: improve
  private getCSSStyles(parentElement: SVGSVGElement) {
    const selectorTextArr = [];

    // Add Parent element Id and Classes to the list
    selectorTextArr.push('#' + parentElement.id);
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let c = 0; c < parentElement.classList.length; c++) {
      if (!selectorTextArr.includes('.' + parentElement.classList[c])) {
        selectorTextArr.push('.' + parentElement.classList[c]);
      }
    }

    // Add Children element Ids and Classes to the list
    const nodes = parentElement.getElementsByTagName('*');
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < nodes.length; i++) {
      const id = nodes[i].id;
      if (!selectorTextArr.includes('#' + id)) {
        selectorTextArr.push('#' + id);
      }

      const classes = nodes[i].classList;
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let c = 0; c < classes.length; c++) {
        if (!selectorTextArr.includes('.' + classes[c])) {
          selectorTextArr.push('.' + classes[c]);
        }
      }
    }

    // Extract CSS Rules
    let extractedCSSText = '';
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < document.styleSheets.length; i++) {
      const s = document.styleSheets[i];

      try {
        if (!s.cssRules) {
          continue;
        }
      } catch (e) {
        if (e.name !== 'SecurityError') {
          throw e;
        } // for Firefox
        continue;
      }

      const cssRules = s.cssRules;
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let r = 0; r < cssRules.length; r++) {
        if (selectorTextArr.includes((cssRules[r] as CSSStyleRule).selectorText)) {
          extractedCSSText += cssRules[r].cssText;
        }
      }
    }

    return extractedCSSText;
  }

  // TODO: improve
  private appendCSS(cssText: string, element: SVGSVGElement) {
    const styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    styleElement.innerHTML = cssText;
    const refNode = element.hasChildNodes() ? element.children[0] : null;
    element.insertBefore(styleElement, refNode);
  }

  private addMetadata(svgString: string) {
    let res = svgString;

    // add Namespaces
    if (!res.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      res = res.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!res.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      res = res.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    // add XML declaration
    if (!res.match(/^<\?xml/)) {
      res = `<?xml version="1.0" standalone="no"?>\r\n${res}`;
    }

    return res;
  }
}
