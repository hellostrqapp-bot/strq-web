import { describe, it, expect } from 'vitest';
import { localePath, localeFromPath, stripLocale } from '../i18n/paths';

describe('localePath', () => {
  it('Engels (standaard) zonder prefix', () => {
    expect(localePath('en', '/app')).toBe('/app');
    expect(localePath('en', '/')).toBe('/');
  });
  it('andere talen met prefix', () => {
    expect(localePath('nl', '/app/coop/join')).toBe('/nl/app/coop/join');
    expect(localePath('qu', '/')).toBe('/qu');
  });
  it('onbekende taal valt terug op standaard', () => {
    expect(localePath('xx', '/login')).toBe('/login');
  });
});

describe('localeFromPath en stripLocale', () => {
  it('herkent alleen een heel padsegment', () => {
    expect(localeFromPath('/nl/app')).toBe('nl');
    expect(localeFromPath('/de')).toBe('de');
    expect(localeFromPath('/news')).toBeNull();
    expect(localeFromPath('/app')).toBeNull();
  });
  it('haalt het prefix weg', () => {
    expect(stripLocale('/nl/app/coop')).toBe('/app/coop');
    expect(stripLocale('/nl')).toBe('/');
    expect(stripLocale('/app')).toBe('/app');
  });
});
