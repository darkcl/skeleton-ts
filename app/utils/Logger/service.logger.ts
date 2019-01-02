import { LogstashLogger } from './Logstash/logstash.logger';
import { getClient } from './Graphite/client/client.store';
import { GraphiteLoggable } from './Graphite/graphite.interfaces';
import os = require('os');
import { LogstashLoggable, LogstashType } from './Logstash/logger.interfaces';

import * as measured from 'measured-core';

class GraphiteConsoleLogger implements GraphiteLoggable {
  write(obj: any, cb: any) {
    console.log(obj);
  }
  end() {}
}

export class ServiceLogger {
  public graphite: GraphiteLoggable;

  private static _shared: ServiceLogger;

  private apiVersion = 'v1';

  static shared(): ServiceLogger {
    if (!this._shared) {
      this._shared = new ServiceLogger();
    }
    return this._shared;
  }

  constructor(
    private graphiteHost: any = process.env.GRAPHITE_HOST || new GraphiteConsoleLogger(),
    private hostName: string = `main.${os.hostname()}`,
    private appName: string = process.env.APPLICATION_NAME || 'skeleton-ts',
    public logstash: LogstashLoggable = new LogstashLogger(process.env.LOG_DIR || '/tmp'),
    private _stat = measured.createCollection(null)
  ) {
    this.graphite = getClient(this.graphiteHost);
  }

  graphiteEvent(name: string): string {
    const env: string = process.env.HOST_ENV || 'local';
    return `${env}.app.${this.appName}.${this.hostName}.${name}`;
  }

  logMessage(message: string) {
    if (process.env.ENABLE_CONSOLE_LOG === '1') {
      console.log(message);
    }
    const logEvent = {
      message: message
    };
    this.logstash.write(logEvent, LogstashType.APIAccessLog, 'info');
  }

  logAPIRequest(req: any, res: any) {
    const { url, headers, method, httpVersion, originalUrl } = req;

    delete headers.cookie;
    delete headers.authorization;

    const startTime: Date = req['_startTime'];

    const now = new Date();
    const duration: number = now.getTime() - startTime.getTime();

    const logEvent = {
      res: {
        statusCode: res.statusCode
      },
      req: {
        url: url,
        headers: headers,
        method: method,
        httpVersion: httpVersion,
        originalUrl: originalUrl
      },
      responseTime: duration,
      timestamp: startTime.getTime()
    };
    this.logstash.write(logEvent, LogstashType.APIAccessLog, 'info');
  }

  logAPIError(err: Error) {
    this.logstash.error(err, LogstashType.APIErrorLog);
  }

  logAPIDuration(req: any) {
    this.logDuration(req);
  }

  private eventHistogram(event: string, histogram: any): any {
    const result = {};
    Object.getOwnPropertyNames(histogram).forEach(v => {
      result[`${event}.${v}`] = histogram[v];
    });
    return result;
  }

  private eventMeter(event: string, meter: any): any {
    const result = {};
    result[event] = meter.count;
    return result;
  }

  private logDuration(req: any, prefix: string = 'api') {
    const startTime: Date = req['_startTime'];
    if (!startTime) {
      console.log('no start time');
      return;
    }
    const now = new Date();
    const duration: number = now.getTime() - startTime.getTime();

    const apiName =
      req['_loggingPath'] !== undefined
        ? req['_loggingPath']
        : [req.method, req.originalUrl.split('/').join('_')].join('_');

    const eventName = this.graphiteEvent(`${prefix}.${apiName}.usage`);
    this._stat.histogram(eventName).update(duration);
    const result = this.eventHistogram(eventName, this._stat.toJSON()[eventName]);
    this.graphite.write(result, function(err) {});
  }

  logAPIStatusCount(req: any, res: any) {
    this.logStatusCount(req, res);
  }

  logCount(key: string) {
    const eventName = this.graphiteEvent(key);
    this._stat.histogram(eventName).update(1);
    const result = this.eventMeter(eventName, this._stat.toJSON()[eventName]);
    this.graphite.write(result, function(err) {});
  }

  private logStatusCount(req: any, res: any, prefix: string = 'api') {
    const apiName =
      req['_loggingPath'] !== undefined
        ? req['_loggingPath']
        : [req.method, req.originalUrl.split('/').join('_')].join('_');
    const eventName = this.graphiteEvent(`${prefix}.${apiName}.count.${res.statusCode}`);
    this._stat.histogram(eventName).update(1);
    const result = this.eventMeter(eventName, this._stat.toJSON()[eventName]);
    this.graphite.write(result, function(err) {});
  }

  end() {
    this.graphite.end();
    this._stat.end();
  }
}
