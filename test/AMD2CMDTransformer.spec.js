import { describe, it } from 'mocha';
import { readFileSync } from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import AMD2CMDTransformer from '../src/AMD2CMDTransformer';

const moduleNameTransform = moduleName => {
  if (moduleName === 'dep1') {
    return './dep1';
  }
  if ((!moduleName.startsWith('.')) && moduleName.indexOf('/') >= 0) {
    return `./${moduleName}`;
  }
  return moduleName;
};

function transformThenSame(amdCodeFileName, cmdCodeFile) {
  const amdCode = readFileSync(join(__dirname, `./code/${amdCodeFileName}`), 'utf-8');
  const cmdCode = readFileSync(join(__dirname, `./code/${cmdCodeFile}`), 'utf-8');

  const actual = new AMD2CMDTransformer(amdCode, moduleNameTransform).transform();
  expect(actual).to.equal(cmdCode);
}

describe('AMD2CMDFormat', () => {
  it('format', () => {
    transformThenSame('amdcode.js', 'cmdcode.js');
  });

  it('format require', () => {
    transformThenSame('amdcode2.js', 'cmdcode.js');
  });

  it('format with defined module name', () => {
    transformThenSame('amdcode3.js', 'cmdcode.js');
  });

  it('format: A dependency-free module define a direct object literal', () => {
    transformThenSame('amdcode4.js', 'cmdcode4.js');
  });

  it('format: require \'require\', \'module\' or \'exports\'.', () => {
    transformThenSame('amdcode5.js', 'cmdcode5.js');
  });
});
