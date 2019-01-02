import * as log4js from 'log4js';
import { LogstashLoggable, LogstashType } from './logger.interfaces';
import path = require('path');

export class LogstashLogger implements LogstashLoggable {
  constructor(private filePath: string) {
    const config = <log4js.Configuration>{
      categories: {
        default: { appenders: ['accessLog'], level: 'info' },
        accessLog: { appenders: ['accessLog'], level: 'info' },
        clamLog: { appenders: ['clamLog'], level: 'info' },
        freshClamLog: { appenders: ['freshClamLog'], level: 'info' },
        clamErrLog: { appenders: ['clamErrLog'], level: 'error' },
        freshClamErrLog: { appenders: ['freshClamErrLog'], level: 'error' },
        errorLog: { appenders: ['errorLog'], level: 'error' }
      },
      appenders: {
        accessLog: {
          type: 'dateFile',
          filename: path.join(filePath, 'access-logstash.log'),
          alwaysIncludePattern: false,
          pattern: '.yyyy-MM-dd',
          filePattern: '%m%n',
          layout: {
            type: 'pattern',
            pattern: '%m'
          }
        },
        errorLog: {
          type: 'dateFile',
          filename: path.join(filePath, 'error-logstash.log'),
          alwaysIncludePattern: false,
          pattern: '.yyyy-MM-dd',
          filePattern: '%m%n',
          layout: {
            type: 'pattern',
            pattern: '%m'
          }
        },
        clamLog: {
          type: 'dateFile',
          filename: path.join(filePath, 'clamav-logstash.log'),
          alwaysIncludePattern: false,
          pattern: '.yyyy-MM-dd',
          filePattern: '%m%n',
          layout: {
            type: 'pattern',
            pattern: '%m'
          }
        },
        freshClamLog: {
          type: 'dateFile',
          filename: path.join(filePath, 'freshclam-logstash.log'),
          alwaysIncludePattern: false,
          pattern: '.yyyy-MM-dd',
          filePattern: '%m%n',
          layout: {
            type: 'pattern',
            pattern: '%m'
          }
        },
        clamErrLog: {
          type: 'dateFile',
          filename: path.join(filePath, 'clamav-err-logstash.log'),
          alwaysIncludePattern: false,
          pattern: '.yyyy-MM-dd',
          filePattern: '%m%n',
          layout: {
            type: 'pattern',
            pattern: '%m'
          }
        },
        freshClamErrLog: {
          type: 'dateFile',
          filename: path.join(filePath, 'freshclam-err-logstash.log'),
          alwaysIncludePattern: false,
          pattern: '.yyyy-MM-dd',
          filePattern: '%m%n',
          layout: {
            type: 'pattern',
            pattern: '%m'
          }
        }
      }
    };

    log4js.configure(config);
  }

  private removeNull(obj: any): any {}

  write(obj: any, type: LogstashType, level: string = 'info') {
    const logger = log4js.getLogger(type);
    logger.level = level;
    logger.info(JSON.stringify(obj));
  }

  error(obj: any, type: LogstashType) {
    const logger = log4js.getLogger(type);
    logger.error(JSON.stringify(obj, Object.getOwnPropertyNames(obj)));
  }

  info(obj: any, type: LogstashType) {
    const logger = log4js.getLogger(type);
    logger.info(JSON.stringify(obj));
  }
}
