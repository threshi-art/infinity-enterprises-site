import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';

test('Ukraine desk base map asset', () => {
  // Read the SVG file
  const svgPath = 'src/assets/ukraine-desk/map/base.svg';
  const svgContent = readFileSync(svgPath, 'utf8');
  
  // Parse root <svg> attributes with regex
  const svgMatch = svgContent.match(/<svg\s+([^>]+)>/);
  assert.ok(svgMatch, 'SVG root element should exist');
  
  const attrs = svgMatch[1];
  
  // Helper to extract attribute value
  const getAttr = (name) => {
    const match = attrs.match(new RegExp(`${name}="([^"]+)"`));
    return match ? match[1] : null;
  };
  
  // Assert viewBox
  const viewBox = getAttr('viewBox');
  assert.strictEqual(viewBox, '0 0 1000 690.00', 'viewBox should be exactly "0 0 1000 690.00"');
  
  // Assert projection
  const projection = getAttr('data-projection');
  assert.strictEqual(projection, 'equirectangular', 'data-projection should be "equirectangular"');
  
  // Assert bounding box coordinates
  const west = parseFloat(getAttr('data-west'));
  const east = parseFloat(getAttr('data-east'));
  const south = parseFloat(getAttr('data-south'));
  const north = parseFloat(getAttr('data-north'));
  const centerLat = parseFloat(getAttr('data-center-lat'));
  
  assert.strictEqual(west, 22.0, 'data-west should be 22.0');
  assert.strictEqual(east, 40.5, 'data-east should be 40.5');
  assert.strictEqual(south, 44.0, 'data-south should be 44.0');
  assert.strictEqual(north, 52.5, 'data-north should be 52.5');
  assert.strictEqual(centerLat, 48.25, 'data-center-lat should be 48.25');
  
  // Assert center-lat equals (south + north) / 2
  const expectedCenterLat = (south + north) / 2;
  assert.strictEqual(centerLat, expectedCenterLat, 'center-lat should equal (south + north) / 2');
  
  // Assert W/H ratio matches projection formula
  const W = 1000;
  const H = 690.00;
  const expectedRatio = (east - west) * Math.cos(centerLat * Math.PI / 180) / (north - south);
  const actualRatio = W / H;
  assert.ok(Math.abs(actualRatio - expectedRatio) < 0.001, 
    `W/H ratio should match projection formula (expected ${expectedRatio}, got ${actualRatio})`);
  
  // Test corner projections
  const projectX = (lon) => (lon - west) / (east - west) * W;
  const projectY = (lat) => (north - lat) / (north - south) * H;
  
  // Four corners
  assert.strictEqual(projectX(west), 0, 'West edge maps to x=0');
  assert.strictEqual(projectX(east), W, 'East edge maps to x=W');
  assert.strictEqual(projectY(north), 0, 'North edge maps to y=0');
  assert.strictEqual(projectY(south), H, 'South edge maps to y=H');
  
  // Center
  const centerX = projectX((west + east) / 2);
  const centerY = projectY(centerLat);
  assert.ok(Math.abs(centerX - W/2) < 0.01, 'Center longitude maps to x=W/2');
  assert.ok(Math.abs(centerY - H/2) < 0.01, 'Center latitude maps to y=H/2');
  
  // Assert no <text element
  assert.ok(!svgContent.includes('<text'), 'SVG should contain no <text element');
  
  // Assert aria-hidden="true"
  const ariaHidden = getAttr('aria-hidden');
  assert.strictEqual(ariaHidden, 'true', 'root should have aria-hidden="true"');
});
