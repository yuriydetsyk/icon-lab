import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Color } from '../../models/enums/color';
import { ColorData } from '../../models/interfaces/color-data';
import { Coordinates } from '../../models/interfaces/coordinates';
import { Sizes } from '../../models/interfaces/sizes';
import { ImageHelper } from '../../shared/helpers/image.helper';
import { ImageService } from './image.service';

describe('ImageService', () => {
  let service: ImageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImageService],
    });
    service = TestBed.inject(ImageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  describe('SVG bodies', () => {
    let iconId: string;
    let svg: SVGSVGElement;
    let innerImage: SVGImageElement;

    beforeEach(() => {
      iconId = '123';
      svg = document.createElementNS(ImageHelper.SVG_NAMESPACE, 'svg');
      innerImage = document.createElementNS(ImageHelper.SVG_NAMESPACE, 'image');
      svg.appendChild(innerImage);
    });

    it('should get a list of SVG bodies', () => {
      service.setIconSvg(iconId, svg);

      expect(service.getIconSvgs().size).toBe(1);
      expect(service.getIconSvgs().get(iconId)).toEqual(svg);
    });

    it('should get an SVG body by a selected index', () => {
      service.setIconSvg(iconId, svg);

      expect(service.getIconSvg(iconId)).toEqual(svg);
    });

    it('should set a cloned version of svg', () => {
      service.setIconSvg(iconId, svg);

      const clonedSvg = service.getIconSvg(iconId);
      expect(clonedSvg).toBeDefined();
      expect(clonedSvg).toEqual(svg);

      // edit the original, so it becomes different with its clone
      innerImage.classList.add('image');
      expect(clonedSvg).not.toEqual(svg);
    });
  });

  describe('createSvg', () => {
    it('should create an SVG element with a selected size', () => {
      const sizes: Sizes = { width: 100, height: 100 };
      const svg = service.createSvg(sizes);

      expect(svg.getAttribute('xmlns')).toBe(ImageHelper.SVG_NAMESPACE);
      expect(+svg.getAttribute('width')).toBe(sizes.width);
      expect(+svg.getAttribute('height')).toBe(sizes.height);
      expect(svg.getAttribute('viewBox')).toBe(`0 0 ${sizes.width} ${sizes.height}`);
    });
  });

  describe('createGroup', () => {
    it('should create an SVG group at the selected coordinates and size', () => {
      const coordinates: Coordinates = { x: 100, y: 100 };
      const groupSize: Sizes = { width: 100, height: 100 };
      const svgGroup = service.createGroup({ coordinates, size: groupSize });

      expect(svgGroup.getAttribute('transform')).toBe(`translate(${coordinates.x},${coordinates.y})`);
    });

    it('should create an SVG group and insert child elements into it', () => {
      const coordinates: Coordinates = { x: 100, y: 100 };
      const rotationAngle = 15;
      const viewBoxSize: Sizes = { width: 150, height: 150 };
      const groupSize: Sizes = { width: 100, height: 100 };
      const svgBody = document.createElementNS(ImageHelper.SVG_NAMESPACE, 'svg');
      svgBody.setAttribute('viewBox', `0 0 ${viewBoxSize.width} ${viewBoxSize.height}`);
      // FIXME: `viewBox` value is undefined for some reason, so we force updating its value
      (svgBody as any).viewBox = { baseVal: { width: viewBoxSize.width, height: viewBoxSize.height } };

      const svgBodyChild = document.createElementNS(ImageHelper.SVG_NAMESPACE, 'g');
      svgBody.appendChild(svgBodyChild);

      const svgGroup = service.createGroup({
        coordinates,
        size: groupSize,
        childElement: svgBody,
        rotationAngle,
      });
      const delta: Sizes = {
        width: groupSize.width / viewBoxSize.width,
        height: groupSize.height / viewBoxSize.height,
      };

      const transformData = svgGroup.getAttribute('transform');
      expect(transformData.includes(`translate(${coordinates.x},${coordinates.y})`)).toBeTruthy();
      expect(transformData.includes(`scale(${delta.width}, ${delta.height})`)).toBeTruthy();
      expect(
        transformData.includes(`rotate(${rotationAngle}, ${groupSize.width / 2}, ${groupSize.height / 2})`)
      ).toBeTruthy();
      expect(svgGroup.children.length).toBe(0);
    });
  });

  describe('createRect', () => {
    it('should create an SVG rectangle by selected sizes', () => {
      const sizes: Sizes = { width: 100, height: 100 };
      const svgRect = service.createRect(sizes);

      expect(+svgRect.getAttribute('x')).toBe(0);
      expect(+svgRect.getAttribute('y')).toBe(0);
      expect(+svgRect.getAttribute('width')).toBe(sizes.width);
      expect(+svgRect.getAttribute('height')).toBe(sizes.height);
    });
  });

  describe('getSVGString', () => {
    it('should generate a stringified representation of the SVG body', () => {
      const svgBody = document.createElementNS(ImageHelper.SVG_NAMESPACE, 'svg');
      svgBody.setAttributeNS('xmlns', 'xlink', 'http://www.w3.org/1999/xlink');
      const svgString = service.getSVGString(svgBody);

      expect(svgString).toBe(
        `<?xml version="1.0" standalone="no"?>\r\n${new XMLSerializer().serializeToString(svgBody)}`
      );
    });
  });

  describe('Color groups management', () => {
    let svg: SVGSVGElement;
    let processedSvg: SVGSVGElement;
    let color1: Color;
    let color2: Color;

    beforeEach(() => {
      svg = document.createElementNS(ImageHelper.SVG_NAMESPACE, 'svg');
      color1 = Color.Light;
      color2 = Color.Violet80;
      const innerImage1 = document.createElementNS(ImageHelper.SVG_NAMESPACE, 'image');
      const innerImage2 = document.createElementNS(ImageHelper.SVG_NAMESPACE, 'image');
      const innerImage3 = document.createElementNS(ImageHelper.SVG_NAMESPACE, 'image');
      innerImage1.setAttribute('fill', color1);
      innerImage2.setAttribute('fill', color1);
      innerImage3.setAttribute('fill', color2);
      svg.appendChild(innerImage1);
      svg.appendChild(innerImage2);
      svg.appendChild(innerImage3);

      processedSvg = service.addFillGroups(svg);
    });

    describe('addFillGroups', () => {
      it('should add fill groups', () => {
        expect(processedSvg.querySelectorAll(`[${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}]`).length).toBe(3);
        expect(
          processedSvg.querySelectorAll(`[${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}="1"][fill="${color1}"]`).length
        ).toBe(2);
        expect(
          processedSvg.querySelectorAll(`[${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}="2"][fill="${color2}"]`).length
        ).toBe(1);
      });

      it('should not edit existing fill groups', () => {
        expect(processedSvg.querySelectorAll(`[${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}]`).length).toBe(3);
        expect(
          processedSvg.querySelectorAll(`[${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}="1"][fill="${color1}"]`).length
        ).toBe(2);
        expect(
          processedSvg.querySelectorAll(`[${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}="2"][fill="${color2}"]`).length
        ).toBe(1);

        processedSvg = service.addFillGroups(svg);
        expect(processedSvg.querySelectorAll(`[${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}]`).length).toBe(3);
        expect(
          processedSvg.querySelectorAll(`[${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}="1"][fill="${color1}"]`).length
        ).toBe(2);
        expect(
          processedSvg.querySelectorAll(`[${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}="2"][fill="${color2}"]`).length
        ).toBe(1);
      });
    });

    describe('getFillData', () => {
      it('should get the SVG fill data', () => {
        const fillData = service.getFillData(processedSvg);

        expect(fillData.length).toBe(2);
        expect(fillData).toEqual([
          {
            index: '1',
            color: color1,
            elements: Array.from(
              processedSvg.querySelectorAll<SVGElement>(`[${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}="1"]`)
            ),
          },
          {
            index: '2',
            color: color2,
            elements: Array.from(
              processedSvg.querySelectorAll<SVGElement>(`[${ImageHelper.DOM_ATTRIBUTES.GROUP_ID}="2"]`)
            ),
          },
        ]);
      });
    });

    describe('setIconColors', () => {
      it('should set SVG color data', () => {
        const colorData: ColorData[] = [{ index: '1', color: Color.White }];
        service.setIconColors(processedSvg, colorData);

        expect(processedSvg.querySelectorAll(`[fill="${color1}"]`).length).toBe(0);
        expect(processedSvg.querySelectorAll(`[fill="${colorData[0].color}"]`).length).toBe(2);
      });
    });
  });

  describe('getElementFillColor', () => {
    it('should get the fill color of the SVG element', () => {
      const color1 = Color.Light;
      const color2 = Color.Violet80;
      const img1 = document.createElementNS(ImageHelper.SVG_NAMESPACE, 'image');
      const img2 = document.createElementNS(ImageHelper.SVG_NAMESPACE, 'image');
      img1.style.fill = color1;
      img2.setAttribute('fill', color2);

      expect(service.getElementFillColor(img1)).toBe(color1);
      expect(service.getElementFillColor(img2)).toBe(color2);
    });
  });
});
