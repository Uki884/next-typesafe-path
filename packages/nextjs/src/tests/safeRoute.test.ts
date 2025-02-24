import { describe, test, expect } from 'vitest';
import { safeRoute } from '../tests/.safe-routes/index';

describe('safeRoute', () => {
  // Case 1: No params, no search params
  test('static route without params', () => {
    expect(safeRoute('/')).toBe('/');
  });

  // Case 2: Only search params
  describe('routes with only search params', () => {
    test('required search params', () => {
      expect(safeRoute('/shop/', { isRequired: true }))
        .toBe('/shop/?isRequired=true');
    });

    test('optional search params', () => {
      expect(safeRoute('/login/')).toBe('/login/');
      expect(safeRoute('/login/', { redirect: '/dashboard' }))
        .toBe('/login/?redirect=%2Fdashboard');
    });
  });

  // Case 3: Only dynamic params
  describe('routes with only dynamic params', () => {
    test('required params', () => {
      expect(safeRoute('/users/[id]/', { id: '123' }))
        .toBe('/users/123/');
    });

    test('optional params (catch-all)', () => {
      expect(safeRoute('/products/[[...filters]]/')).toBe('/products/');
      expect(safeRoute('/products/[[...filters]]/', { filters: ['sale', 'winter'] }))
        .toBe('/products/sale/winter/');
    });

    test('required params (catch-all)', () => {
      expect(safeRoute('/shop/[...categories]/', { categories: ['men', 'shoes'] }))
        .toBe('/shop/men/shoes/');
    });
  });

  // Case 4: Both params and search params
  describe('routes with both params and search params', () => {
    test('required params and required search params', () => {
      expect(safeRoute('/users/[id]/', { id: '123' }, { page: 1 }))
        .toBe('/users/123/?page=1');
    });

    test('required params and optional search params', () => {
      expect(safeRoute('/users/[id]/', { id: '123' }))
        .toBe('/users/123/');
      expect(safeRoute('/users/[id]/', { id: '123' }, { tab: 'profile' }))
        .toBe('/users/123/?tab=profile');
    });

    test('optional params and required search params', () => {
      expect(safeRoute('/products/[[...filters]]/', {}, { page: 1 }))
        .toBe('/products/?page=1');
      expect(safeRoute('/products/[[...filters]]/', { filters: ['sale'] }, { page: 1 }))
        .toBe('/products/sale/?page=1');
    });

    test('optional params and optional search params', () => {
      expect(safeRoute('/products/[[...filters]]/')).toBe('/products/');
      expect(safeRoute('/products/[[...filters]]/', { filters: ['sale'] }))
        .toBe('/products/sale/');
      expect(safeRoute('/products/[[...filters]]/', { filters: ['sale'] }, { sort: 'asc' }))
        .toBe('/products/sale/?sort=asc');
    });
  });

  // Case 5: Multiple dynamic params
  test('multiple dynamic params', () => {
    expect(safeRoute('/users/[userId]/posts/[postId]/', {
      userId: '123',
      postId: '456'
    })).toBe('/users/123/posts/456/');
  });

  // Case 6: Special characters and encoding
  test('handles special characters and encoding', () => {
    expect(safeRoute('/search/', { q: 'hello world' }))
      .toBe('/search/?q=hello%20world');
    expect(safeRoute('/users/[id]/', { id: '123+456' }, { filter: '&special=' }))
      .toBe('/users/123+456/?filter=%26special%3D');
  });

  // Case 7: Array parameters
  test('handles array parameters', () => {
    expect(safeRoute('/shop/', { tags: ['t1', 't2'] }))
      .toBe('/shop/?tags=t1&tags=t2');
  });

  // Case 8: Kebab case conversion
  test('converts kebab case to camel case in params', () => {
    expect(safeRoute('/users/[user-id]/', { userId: '123' }))
      .toBe('/users/123/');
  });
}); 