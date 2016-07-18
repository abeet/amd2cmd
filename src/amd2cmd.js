'use strict';

import vfs from 'vinyl-fs';
import map from 'map-stream';
import { Buffer } from 'buffer';
import _ from 'lodash';
import { join, relative, dirname, isAbsolute } from 'path';
import { existsSync, statSync } from 'fs';
import AMD2CMDTransformer from './AMD2CMDTransformer';

export class ModulePathTransform {
  /**
   * Creates an instance of ModulePathTransform.
   *
   * @param {String} filepath
   * @param {String} basedir
   */
  constructor(filepath, basedir) {
    this.filepath = filepath;
    this.basedir = basedir;
  }

  /**
   * transform module path to commonjs pattern
   *
   * @param {String} modulePath module path
   * @returns {String} return transformed module path
   */
  transform(modulePath) {
    if (modulePath.startsWith('.')) {
      return modulePath;
    } else if (modulePath.indexOf('/') === -1) {
      if (existsSync(`${join(this.filepath, modulePath)}.js`)) {
        return `./${modulePath}`;
      }
      return modulePath;
    }
    const result = relative(this.filepath, join(this.basedir, modulePath)).replace(/\\+/g, '/');
    if (!result.startsWith('.')) {
      return `./${result}`;
    }
    return result;
  }
}

function generateCodeTransformFn(basedir) {
  return (file, cb) => {
    const modulePathTransformer = new ModulePathTransform(dirname(file.path), basedir || file.base);
    const modulePathTransformFn = (modulePath) => modulePathTransformer.transform(modulePath);
    if (file.isBuffer()) {
      /* eslint no-param-reassign:0 */
      file.contents = Buffer.from(new AMD2CMDTransformer(file.contents.toString('utf-8'),
        modulePathTransformFn).transform(), 'utf-8');
      cb(null, file);
    } else if (file.isStream()) {
      cb(new Error('amd2cmd: Streams not support.'), file);
    }
  };
}

export function formatFilePath(filepath) {
  if (filepath && (!isAbsolute(filepath))) {
    return join(process.cwd(), filepath);
  }

  return filepath;
}

export function formatFilePathToGlob(filepath) {
  const formatPath = formatFilePath(filepath);
  if (existsSync(formatPath)) {
    const stats = statSync(formatPath);
    if (stats && stats.isDirectory()) {
      return join(formatPath, '**/*.js');
    }
  }
  return formatPath;
}

/**
 * transform amd code to commonjs code
 *
 * @export
 * @param {String} code the amd code
 * @param {String} filepath the file path of amd module
 * @param {String} basedir the base dir of amd modules
 *
 * @returns {String} return commonjs code
 */
export function transformCode(code, filepath, basedir) {
  const modulePathTransformer = new ModulePathTransform(filepath, basedir);
  const modulePathTransformFn = (modulePath) => modulePathTransformer.transform(modulePath);
  return new AMD2CMDTransformer(code, modulePathTransformFn).transform();
}

/**
 * transform amd code to cmd, and this method is used in gulp.
 *
 * @export
 * @param {String} basedir
 * @returns {Stream} returns transform stream.
 */
export function transform(basedir) {
  const mapFn = generateCodeTransformFn(formatFilePath(basedir));
  return map(mapFn);
}

/**
 * transform amd code to cmd code
 *
 * @export
 * @param {String[]} inFiles files pattern which will be transformed, pattern visit https://github.com/isaacs/node-glob
 * @param {String} outDir target directory
 * @param {String?} basedir amd module base dir. If relative path, will join with `process.cwd()`, or if null, will reguest basedir from inFiles, visit https://github.com/gulpjs/vinyl#optionsbase
 */
export function amd2cmd(inFiles, outDir, basedir) {
  return vfs.src(_.map(inFiles, formatFilePathToGlob), { buffer: true })
   .pipe(transform(basedir))
   .pipe(vfs.dest(outDir));
}
