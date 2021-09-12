import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

import { IconDto } from '../../models/dto/icon-dto';
import { Color } from '../../models/enums/color';
import { IconPosition } from '../../models/enums/icon-position';
import { IconType } from '../../models/enums/icon-type';
import { LayoutMode } from '../../models/enums/layout-mode';
import { StorageKey } from '../../models/enums/storage-key';
import { ColorData, ColorExtendedData } from '../../models/interfaces/color-data';
import { LayoutModeChangeData } from '../../models/interfaces/layout-mode-change-data';
import { PositionSettings } from '../../models/interfaces/position-settings';
import { ImageHelper } from '../../shared/helpers/image.helper';
import { BackgroundService } from './background.service';
import { IconService } from './icon.service';
import { ImageService } from './image.service';
import { LabService } from './lab.service';
import { StorageService } from './storage.service';

describe('LabService', () => {
  let service: LabService;
  let storageService: StorageService;
  let imageService: ImageService;

  beforeEach(() => {
    const iconServiceStub = () => ({ getIcons: () => of([]) });
    const imageServiceStub = () => ({
      createSvg: (artboardSize: any) => ({ appendChild: () => ({}) }),
      createGroup: (arg: any, svgBody: any) => ({}),
      exportSvg: (wrapperSvg: any) => ({}),
      exportRaster: (wrapperSvg: any, width: any, height: any, str: any) => ({}),
      getElementFillColor: (el: SVGElement) => el.getAttribute('fill') || el.style.fill,
      getFillData: (svgBody: SVGSVGElement) => [] as any[],
    });
    const storageServiceStub = () => ({
      set: (key: string, value: any) => ({}),
      getMap: (labIcons: any) => ({}),
      get: (labLayoutMode: any) => null as any,
    });
    const backgroundServiceStub = {
      backgroundChanged: of({}),
      background: {},
    };
    TestBed.configureTestingModule({
      providers: [
        LabService,
        { provide: IconService, useFactory: iconServiceStub },
        { provide: ImageService, useFactory: imageServiceStub },
        { provide: StorageService, useFactory: storageServiceStub },
        { provide: BackgroundService, useValue: backgroundServiceStub },
      ],
    });
    service = TestBed.inject(LabService);
    storageService = TestBed.inject(StorageService);
    imageService = TestBed.inject(ImageService);
  });

  it('can load instance', fakeAsync(() => {
    expect(service).toBeTruthy();
    service.layoutModeChanged.pipe(first()).subscribe((data) => {
      expect(data).toEqual({ mode: LayoutMode.BottomRight });
    });

    tick();
  }));

  describe('recentIconsChanged', () => {
    it('should return 8 recent icons with the unique IDs', fakeAsync(() => {
      const iconsMap = [
        [IconPosition.Center, { id: '1' }],
        [IconPosition.Center, { id: '2' }],
        [IconPosition.BottomLeft, { id: '3' }],
        [IconPosition.BottomLeft, { id: '4' }],
        [IconPosition.BottomRight, { id: '5' }],
        [IconPosition.BottomRight, { id: '6' }],
        [IconPosition.TopLeft, { id: '1' }],
        [IconPosition.TopLeft, { id: '2' }],
        [IconPosition.TopRight, { id: '3' }],
        [IconPosition.TopRight, { id: '4' }],
        [IconPosition.Center, { id: '7' }],
        [IconPosition.Center, { id: '8' }],
      ] as [IconPosition, IconDto][];
      iconsMap.forEach(([position, icon]) => {
        service.setIcon(icon, position);
      });

      service.recentIconsChanged.pipe(first()).subscribe((icons) => {
        expect(icons.length).toBe(8);
        expect(icons.filter((icon) => ['1', '2', '3', '4'].includes(icon.id)).length).toBe(4);
      });

      tick();
    }));
  });

  describe('setIcon', () => {
    it('should set an icon', fakeAsync(() => {
      const storageServiceSpy = spyOn(storageService, 'set');
      const icon = { id: '1' } as IconDto;
      const iconsRes = new Map<IconPosition, IconDto>([[IconPosition.Center, icon]]);

      service.setIcon(icon, IconPosition.Center);

      service.positionSettingsChanged.pipe(first()).subscribe((positionSettings) => {
        expect(storageServiceSpy).toHaveBeenCalledWith(StorageKey.LabPositionSettings, [...positionSettings]);
      });

      service.iconsChanged.pipe(first()).subscribe((icons) => {
        expect(icons).toEqual(iconsRes);
      });
      service.recentIconsChanged.pipe(first()).subscribe((icons) => {
        expect(icons).toEqual([icon]);
      });

      tick();
    }));

    it('should not set an icon, if position is missing', fakeAsync(() => {
      const storageServiceSpy = spyOn(storageService, 'set');

      service.setIcon({ id: '1' } as IconDto);

      expect(storageServiceSpy).not.toHaveBeenCalled();
      service.iconsChanged.pipe(first()).subscribe((icons) => {
        expect(icons.size).toBe(0);
      });
      service.recentIconsChanged.pipe(first()).subscribe((icons) => {
        expect(icons.length).toBe(0);
      });

      tick();
    }));

    it('should not set an icon, if it has not been changed', fakeAsync(() => {
      const storageServiceSpy = spyOn(storageService, 'set');
      const icon = { id: '1' } as IconDto;

      service.setIcon(icon, IconPosition.Center);
      service.setIcon(icon, IconPosition.Center);

      expect(storageServiceSpy).toHaveBeenCalledTimes(1);
      service.iconsChanged.pipe(first()).subscribe((icons) => {
        expect(icons.size).toBe(1);
      });
      service.recentIconsChanged.pipe(first()).subscribe((icons) => {
        expect(icons.length).toBe(1);
      });

      tick();
    }));
  });

  describe('Position settings', () => {
    let saveToStorageSpy: jasmine.Spy;
    let settingItem: PositionSettings;
    let position: IconPosition;

    beforeEach(() => {
      saveToStorageSpy = spyOn(storageService, 'set');
      settingItem = {
        icon: { id: '1' } as IconDto,
        colors: [{ index: '1', color: Color.Yellow }],
        rotationAngle: 15,
      };
      position = IconPosition.Center;
    });

    it('should set the position settings', fakeAsync(() => {
      const positionSettings = new Map<IconPosition, PositionSettings>([[position, settingItem]]);

      service.setPositionSettings(positionSettings);

      service.positionSettingsChanged.pipe(first()).subscribe((res) => {
        expect(res).toEqual(positionSettings);
        expect(saveToStorageSpy).toHaveBeenCalled();
        expect(saveToStorageSpy).toHaveBeenCalledWith(StorageKey.LabPositionSettings, [...positionSettings]);
      });

      service.recentIconsChanged.pipe(first()).subscribe((res) => {
        expect(res).toEqual([...positionSettings.values()].map((setting) => setting.icon));
      });

      tick();
    }));

    it('should set the position settings and do not save them', fakeAsync(() => {
      const positionSettings = new Map<IconPosition, PositionSettings>([[position, settingItem]]);

      service.setPositionSettings(positionSettings, false);

      service.positionSettingsChanged.pipe(first()).subscribe((res) => {
        expect(res).toEqual(positionSettings);
        expect(saveToStorageSpy).not.toHaveBeenCalled();
      });

      service.recentIconsChanged.pipe(first()).subscribe((res) => {
        expect(res).toEqual([...positionSettings.values()].map((setting) => setting.icon));
      });

      tick();
    }));

    it('should set a single position setting', fakeAsync(() => {
      const positionSettings = new Map<IconPosition, PositionSettings>([[position, settingItem]]);
      service.setPositionSettings(positionSettings, false);

      const updatedSettingItem: PositionSettings = { ...settingItem, rotationAngle: -15 };
      service.setPositionSetting(updatedSettingItem, position);

      let updatedSettings = new Map<IconPosition, PositionSettings>([[position, updatedSettingItem]]);

      service.positionSettingsChanged.pipe(first()).subscribe((res) => {
        expect(res).toEqual(updatedSettings);
        expect(saveToStorageSpy).toHaveBeenCalled();
        expect(saveToStorageSpy).toHaveBeenCalledWith(StorageKey.LabPositionSettings, [...updatedSettings]);
      });

      service.recentIconsChanged.pipe(first()).subscribe((res) => {
        expect(res).toEqual([...updatedSettings.values()].map((setting) => setting.icon));
      });

      tick();

      const newSettingItem: PositionSettings = { ...settingItem, icon: { ...settingItem.icon, id: '2' } };
      const newPosition = IconPosition.BottomRight;
      service.setPositionSetting(newSettingItem, newPosition);

      updatedSettings = new Map<IconPosition, PositionSettings>([
        [position, updatedSettingItem],
        [newPosition, newSettingItem],
      ]);

      service.positionSettingsChanged.pipe(first()).subscribe((res) => {
        expect(res).toEqual(updatedSettings);
        expect(saveToStorageSpy).toHaveBeenCalledTimes(2);
        expect(saveToStorageSpy).toHaveBeenCalledWith(StorageKey.LabPositionSettings, [...updatedSettings]);
      });

      service.recentIconsChanged.pipe(first()).subscribe((res) => {
        expect(res).toEqual([...updatedSettings.values()].map((setting) => setting.icon));
      });

      tick();
    }));

    it('should not set a single setting, if the position is missing', () => {
      service.setPositionSetting(settingItem, null);
      expect(saveToStorageSpy).not.toHaveBeenCalled();
    });

    it('should clear the setting for the selected position', fakeAsync(() => {
      const positionSettings = new Map<IconPosition, PositionSettings>([[position, settingItem]]);
      service.setPositionSettings(positionSettings);

      service.positionSettingsChanged.pipe(first()).subscribe((res) => {
        expect(res).toEqual(positionSettings);
      });

      tick();

      service.clearPositionSetting(position);
      service.positionSettingsChanged.pipe(first()).subscribe((res) => {
        expect(res).toEqual(new Map<IconPosition, PositionSettings>([]));
      });

      tick();
    }));

    it('should not clear a setting, if the position is missing', () => {
      service.clearPositionSetting(null);
      expect(saveToStorageSpy).not.toHaveBeenCalled();
    });
  });

  describe('setPosition', () => {
    it('should set a position', fakeAsync(() => {
      const position = IconPosition.TopRight;
      service.setPosition(position);

      service.positionChanged.pipe(first()).subscribe((res) => {
        expect(res).toBe(position);
      });

      tick();
    }));

    it('should set a position with svg body', fakeAsync(() => {
      const position = IconPosition.TopRight;
      const svg = document.createElementNS(ImageHelper.SVG_NAMESPACE, 'svg');
      service.setPosition(position, svg);

      service.positionChanged.pipe(first()).subscribe((res) => {
        expect(res).toBe(position);
      });
      service.filledElementsChanged.pipe(first()).subscribe((filledElements) => {
        expect(filledElements).toEqual(imageService.getFillData(svg));
      });

      tick();
    }));
  });

  describe('unsetPosition', () => {
    it('should unset a selected position', fakeAsync(() => {
      const position = IconPosition.TopRight;
      service.setPosition(position);

      service.positionChanged.pipe(first()).subscribe((res) => {
        expect(res).toBe(position);
      });

      service.unsetPosition();

      service.positionChanged.pipe(first()).subscribe((res) => {
        expect(res).toBeNull();
      });

      tick();
    }));
  });

  describe('setColor', () => {
    it('should set a color', fakeAsync(() => {
      const color = Color.Blue;
      const index = '1';
      const position = IconPosition.TopRight;

      service.setColor(color, index, position);

      service.colorChanged.pipe(first()).subscribe((data) => {
        expect(data).toEqual({ color, index, position } as ColorExtendedData);
      });

      tick();
    }));

    it('should not set a color, if position is missing', () => {
      const storageServiceSpy = spyOn(storageService, 'set');

      service.setColor(Color.Blue, '1');

      expect(storageServiceSpy).not.toHaveBeenCalled();
    });

    it('should update a color, if it already exists', fakeAsync(() => {
      let color = Color.Blue;
      const index = '1';
      const position = IconPosition.TopRight;

      service.setColor(color, index, position);

      service.colorChanged.pipe(first()).subscribe((data) => {
        expect(data).toEqual({ color, index, position } as ColorExtendedData);
      });

      color = Color.White;
      service.setColor(color, index, position);

      service.colorChanged.pipe(first()).subscribe((data) => {
        expect(data).toEqual({ color, index, position } as ColorExtendedData);
      });

      tick();
    }));
  });

  describe('setColors', () => {
    it('should set colors', fakeAsync(() => {
      const colors: ColorData[] = [
        { index: '1', color: Color.Light },
        { index: '2', color: Color.LightBlue },
      ];
      const position = IconPosition.Center;

      service.setColors(colors, position);

      service.positionSettingsChanged.pipe(first()).subscribe((res) => {
        expect(res.get(position).colors).toEqual(colors);
      });

      tick();
    }));

    it('should not set colors, if position is missing', () => {
      const storageServiceSpy = spyOn(storageService, 'set');

      service.setColors([{ index: '1', color: Color.Light }], null);

      expect(storageServiceSpy).not.toHaveBeenCalled();
    });

    it('should update colors, if they already exist at the selected position', fakeAsync(() => {
      const colors: ColorData[] = [
        { index: '1', color: Color.Light },
        { index: '2', color: Color.LightBlue },
      ];
      const position = IconPosition.Center;

      service.setColors(colors, position);

      service.positionSettingsChanged.pipe(first()).subscribe((res) => {
        expect(res.get(position).colors).toEqual(colors);
      });

      colors.push({ index: '3', color: Color.Violet100 });
      service.setColors(colors, position);

      service.positionSettingsChanged.pipe(first()).subscribe((res) => {
        expect(res.get(position).colors).toEqual(colors);
      });

      tick();
    }));
  });

  describe('clearColors', () => {
    it('should clear colors at the selected position', fakeAsync(() => {
      const position1 = IconPosition.Center;
      const position2 = IconPosition.TopLeft;
      service.setColors([{ index: '1', color: Color.Violet100 }], position1);
      service.setColors([{ index: '1', color: Color.Violet20 }], position2);

      service.positionSettingsChanged.pipe(first()).subscribe((res) => {
        expect(res.get(position1).colors.length + res.get(position2).colors.length).toBe(2);
      });

      service.clearColors(position1);

      service.positionSettingsChanged.pipe(first()).subscribe((res) => {
        expect(res.get(position1).colors.length).toBe(0);
        expect(res.get(position2).colors.length).toBe(1);
      });

      tick();
    }));

    it('should not clear colors, if none were found at the selected position', fakeAsync(() => {
      const position1 = IconPosition.Center;
      const position2 = IconPosition.TopRight;
      service.setColors([{ index: '1', color: Color.Violet100 }], position1);

      service.positionSettingsChanged.pipe(first()).subscribe((res) => {
        expect(res.get(position1).colors.length).toBe(1);
        expect(res.get(position2)).toBeUndefined();
      });

      service.clearColors(position2);

      service.positionSettingsChanged.pipe(first()).subscribe((res) => {
        expect(res.get(position1).colors.length).toBe(1);
        expect(res.get(position2)).toBeUndefined();
      });

      tick();
    }));
  });

  describe('setLayoutMode', () => {
    it('should set a layout mode', fakeAsync(() => {
      const storageServiceSpy = spyOn(storageService, 'set');
      const layoutMode = LayoutMode.Single;
      const layoutModeRes: LayoutModeChangeData = {
        mode: layoutMode,
        oldMode: LayoutMode.BottomRight,
      };

      service.setLayoutMode(layoutMode);

      expect(storageServiceSpy).toHaveBeenCalledWith(StorageKey.LabLayoutMode, layoutMode);
      service.layoutModeChanged.pipe(first()).subscribe((res) => {
        expect(res).toEqual(layoutModeRes);
      });
      service.positionChanged.pipe(first()).subscribe((position) => {
        expect(position).toBeNull();
      });

      tick();
    }));

    it('should not set a layout mode, if it has not been changed', fakeAsync(() => {
      const storageServiceSpy = spyOn(storageService, 'set');
      const layoutMode = LayoutMode.Single;
      const layoutModeRes: LayoutModeChangeData = {
        mode: layoutMode,
        oldMode: LayoutMode.BottomRight,
      };

      service.setLayoutMode(layoutMode);
      service.setLayoutMode(layoutMode);

      expect(storageServiceSpy).toHaveBeenCalledTimes(1);
      service.layoutModeChanged.pipe(first()).subscribe((res) => {
        expect(res).toEqual(layoutModeRes);
      });
      service.positionChanged.pipe(first()).subscribe((position) => {
        expect(position).toBeNull();
      });

      tick();
    }));
  });

  describe('addToSavedColors', () => {
    it('should save a color', fakeAsync(() => {
      const storageServiceSpy = spyOn(storageService, 'set');
      const color = Color.Yellow;

      service.addToSavedColors(color);

      expect(storageServiceSpy).toHaveBeenCalledWith(StorageKey.LabSavedColors, [color]);
      service.savedColorsChanged.pipe(first()).subscribe((colors) => {
        expect(colors).toEqual([color]);
      });

      tick();
    }));

    it('should not save a color, if it was already saved', fakeAsync(() => {
      const storageServiceSpy = spyOn(storageService, 'set');
      const color1 = Color.Yellow;
      const color2 = Color.Background;

      service.addToSavedColors(color1);
      service.addToSavedColors(color1);

      expect(storageServiceSpy).toHaveBeenCalledTimes(1);
      expect(storageServiceSpy).toHaveBeenCalledWith(StorageKey.LabSavedColors, [color1]);

      service.addToSavedColors(color2);

      expect(storageServiceSpy).toHaveBeenCalledTimes(2);
      service.savedColorsChanged.pipe(first()).subscribe((colors) => {
        expect(colors).toEqual([color1, color2]);
      });

      tick();
    }));
  });

  describe('removeFromSavedColors', () => {
    it('should remove a saved color', fakeAsync(() => {
      const storageServiceSpy = spyOn(storageService, 'set');
      const color1 = Color.Yellow;
      const color2 = Color.Rose;

      service.addToSavedColors(color1);
      service.addToSavedColors(color2);
      service.removeFromSavedColors(color1);

      expect(storageServiceSpy).toHaveBeenCalledTimes(3);
      expect(storageServiceSpy).toHaveBeenCalledWith(StorageKey.LabSavedColors, [color2]);
      service.savedColorsChanged.pipe(first()).subscribe((colors) => {
        expect(colors).toEqual([color2]);
      });

      tick();
    }));
  });

  describe('replaceSavedColors', () => {
    it('should replace all saved colors', fakeAsync(() => {
      const storageServiceSpy = spyOn(storageService, 'set');
      const colorSet1 = [Color.Yellow, Color.Rose];
      const colorSet2 = [Color.Rose, Color.LightPurple];

      service.replaceSavedColors(colorSet1);

      expect(storageServiceSpy).toHaveBeenCalledWith(StorageKey.LabSavedColors, colorSet1);
      service.savedColorsChanged.pipe(first()).subscribe((colors) => {
        expect(colors).toEqual(colorSet1);
      });

      service.replaceSavedColors(colorSet2);

      expect(storageServiceSpy).toHaveBeenCalledWith(StorageKey.LabSavedColors, colorSet2);
      service.savedColorsChanged.pipe(first()).subscribe((colors) => {
        expect(colors).toEqual(colorSet2);
      });

      tick();
    }));
  });

  describe('setSvg', () => {
    it('should emit filled elements after setting SVG', fakeAsync(() => {
      const svg = document.createElementNS(ImageHelper.SVG_NAMESPACE, 'svg');
      const position = IconPosition.Center;
      service.setSvg(svg, position, true);

      service.filledElementsChanged.pipe(first()).subscribe((filledElements) => {
        expect(filledElements).toEqual(imageService.getFillData(svg));
      });

      tick();
    }));
  });

  describe('exportImage', () => {
    it('should export an SVG artboard', () => {
      const exportSvgSpy = spyOn(imageService, 'exportSvg');

      service.exportImage(IconType.Vector);

      expect(exportSvgSpy).toHaveBeenCalled();
    });

    it('should export a raster artboard', () => {
      const exportRasterSpy = spyOn(imageService, 'exportRaster');

      service.exportImage(IconType.Raster);

      expect(exportRasterSpy).toHaveBeenCalled();
    });
  });

  describe('getIconSize', () => {
    it('should get correct icon sizes', () => {
      expect(service.getIconSize(IconPosition.Center, LayoutMode.BottomRight)).toEqual({
        ...ImageHelper.MAIN_ICON_SIZE,
      });
      expect(service.getIconSize(IconPosition.BottomRight, LayoutMode.BottomRight)).toEqual({
        ...ImageHelper.SUB_ICON_SIZE,
      });
      expect(service.getIconSize(IconPosition.Center, LayoutMode.Single)).toEqual({
        ...ImageHelper.SINGLE_ICON_SIZE,
      });
    });
  });

  describe('Rotation Angles', () => {
    describe('setAngle', () => {
      it('should set the angle for the selected position', fakeAsync(() => {
        const angle = 15;
        const position = IconPosition.Center;
        service.setAngle(angle, position);

        service.positionSettingsChanged.pipe(first()).subscribe((data) => {
          expect(data).toEqual(
            new Map<IconPosition, PositionSettings>([[position, { rotationAngle: angle } as PositionSettings]])
          );
        });

        tick();
      }));

      it('should update the position angle, if it already exists', fakeAsync(() => {
        const angle = 15;
        const angle2 = 20;
        const position = IconPosition.Center;
        service.setAngle(angle, position);

        service.positionSettingsChanged.pipe(first()).subscribe((data) => {
          expect(data).toEqual(
            new Map<IconPosition, PositionSettings>([[position, { rotationAngle: angle } as PositionSettings]])
          );
        });

        tick();

        service.setAngle(angle2, position);

        service.positionSettingsChanged.pipe(first()).subscribe((data) => {
          expect(data).toEqual(
            new Map<IconPosition, PositionSettings>([[position, { rotationAngle: angle2 } as PositionSettings]])
          );
        });

        tick();
      }));

      it('should not set the angle, if the position is missing', () => {
        const storageServiceSpy = spyOn(storageService, 'set');
        const angle = 15;
        const position = IconPosition.Center;
        service.setAngle(angle);

        expect(storageServiceSpy).not.toHaveBeenCalled();
      });

      it('should set the angle for the current position, if the custom one is missing', fakeAsync(() => {
        const angle = 15;
        const position = IconPosition.Center;
        service.setPosition(position);

        tick();

        service.setAngle(angle);

        service.positionSettingsChanged.pipe(first()).subscribe((data) => {
          expect(data).toEqual(
            new Map<IconPosition, PositionSettings>([[position, { rotationAngle: angle } as PositionSettings]])
          );
        });

        tick();
      }));

      it('should not update the angle, if it has the same value', fakeAsync(() => {
        const angle = 15;
        const position = IconPosition.Center;
        const storageServiceSpy = spyOn(storageService, 'set');

        service.setAngle(angle, position);

        service.positionSettingsChanged.pipe(first()).subscribe((data) => {
          expect(storageServiceSpy).toHaveBeenCalled();
        });

        tick();

        service.setAngle(angle, position);

        service.positionSettingsChanged.pipe(first()).subscribe((data) => {
          expect(storageServiceSpy).toHaveBeenCalledTimes(1);
        });

        tick();
      }));

      it('should get the angle', fakeAsync(() => {
        const angle = 15;
        const position = IconPosition.Center;

        service.setAngle(angle, position);

        tick();

        expect(service.getAngle(position)).toBe(angle);
      }));

      it('should not get an angle, if the position is missing', () => {
        expect(service.getAngle(null)).toBeUndefined();
      });
    });
  });
});
