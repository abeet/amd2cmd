import { describe, it } from 'mocha';
import { readFileSync } from 'fs';
import { join } from 'path';
import { expect } from 'chai';
import AMD2CMDTransformer from '../src/AMD2CMDTransformer';

const amdCode = readFileSync(join(__dirname, './code/amdcode.js'), 'utf-8');
const amdCode2 = readFileSync(join(__dirname, './code/amdcode2.js'), 'utf-8');
const amdCode3 = readFileSync(join(__dirname, './code/amdcode3.js'), 'utf-8');
const amdCode4 = readFileSync(join(__dirname, './code/amdcode4.js'), 'utf-8');
const cmdCode = readFileSync(join(__dirname, './code/cmdcode.js'), 'utf-8');
const cmdCode4 = readFileSync(join(__dirname, './code/cmdcode4.js'), 'utf-8');

describe('AMD2CMDFormat', () => {
  const moduleNameTransform = moduleName => {
    if (moduleName === 'dep1') {
      return './dep1';
    }
    if ((!moduleName.startsWith('.')) && moduleName.indexOf('/') >= 0) {
      return `./${moduleName}`;
    }
    return moduleName;
  };

  it('format', () => {
    const actual = new AMD2CMDTransformer(amdCode, moduleNameTransform).transform();
    expect(actual).to.eql(cmdCode);
  });

  it('format require', () => {
    const actual = new AMD2CMDTransformer(amdCode2, moduleNameTransform).transform();
    expect(actual).to.eql(cmdCode);
  });

  it('format with defined module name', () => {
    const actual = new AMD2CMDTransformer(amdCode3, moduleNameTransform).transform();
    expect(actual).to.eql(cmdCode);
  });

  it('format: A dependency-free module define a direct object literal', () => {
    const actual = new AMD2CMDTransformer(amdCode4, moduleNameTransform).transform();
    expect(actual).to.equal(cmdCode4);
  });
});
