import { describe, it, afterEach } from 'mocha';
import { expect } from 'chai';
import { join } from 'path';
import { readFileSync } from 'fs';
import del from 'del';
import vfs from 'vinyl-fs';
import amd2cmd, {
  ModulePathTransform,
  formatFilePath,
  formatFilePathToGlob,
  transformCode,
  transform,
} from '../src/amd2cmd';


const amdCode = readFileSync(join(__dirname, 'code/amdcode.js'), 'utf-8');
const cmdCode = readFileSync(join(__dirname, './code/cmdcode.js'), 'utf-8');
const basedir = join(__dirname, 'code');
const outDir = join(__dirname, '../build/tmp');
const inFiles = [join(__dirname, './code/**/*.js')];

describe('amd2cmd', () => {
  afterEach(done => {
    del('../build/tmp', { force: true }).then(() => done(), done);
  });
  it('transform module path', () => {
    const transformer = new ModulePathTransform('base/modules/moduleA', 'base');
    expect(transformer.transform('modules/moduleB/index'))
      .to.equal('../moduleB/index');
    expect(transformer.transform('modules/moduleA/fnA'))
      .to.equal('./fnA');
  });

  it('transform amd code', done => {
    amd2cmd(inFiles, outDir, basedir)
    .on('finish', () => {
      expect(readFileSync(join(outDir, 'amdcode.js'), 'utf-8')).equal(cmdCode);
      expect(readFileSync(join(outDir, 'cmdcode.js'), 'utf-8')).equal(cmdCode);
      done();
    });
  });

  it('format file path', () => {
    expect(formatFilePath('./test.js')).to.equal(join(process.cwd(), 'test.js'));
    expect(formatFilePath(null)).to.equal(null);
    expect(formatFilePath('/test/*')).to.equal('/test/*');
  });

  it('format file path glob', () => {
    expect(formatFilePathToGlob(__dirname)).to.equal(join(__dirname, '**/*.js'));
    expect(formatFilePathToGlob('/test/**/*')).to.equal('/test/**/*');
  });

  it('transform code string', () => {
    const filepath = basedir;
    expect(transformCode(amdCode, filepath, basedir)).to.equal(cmdCode);
  });

  it('transform vinyl stream file throw error', done => {
    vfs.src(inFiles, { buffer: false })
      .pipe(transform(basedir))
      .on('error', error => {
        expect(error).to.be.an('error');
        done();
      });
  });
});
