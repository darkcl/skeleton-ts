import { Tail } from 'tail';
import { LogstashLoggable, LogstashType } from '../Logstash/logger.interfaces';
import { ServiceLogger } from '../service.logger';

export interface Tailable {
  /** Callback to listen for newlines appended to file */
  on(eventType: 'line', cb: (data: any) => void): void;
  /** Error callback */
  on(eventType: 'error', cb: (error: any) => void): void;
  /** Stop watching file */
  unwatch(): void;
  /** Start watching file if previously stopped */
  watch(): void;
}

export interface TailLoggable {
  start();
  end();
}

export class TailingLogger implements TailLoggable {
  constructor(
    private filePath: string,
    private type: LogstashType,
    private loggable: LogstashLoggable = ServiceLogger.shared().logstash,
    private level: string = 'info',
    private tailer: Tailable = new Tail(filePath)
  ) {}

  start() {
    console.log('started');
    this.tailer.on('line', data => {
      const obj = { message: data };
      this.loggable.write(JSON.stringify(obj), this.type, this.level);
    });
  }

  end() {
    this.tailer.unwatch();
  }
}
