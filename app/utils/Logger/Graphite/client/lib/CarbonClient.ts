import LazySocket = require('./lazy-socket.js');
import url = require('url');

interface CarbonClientOption {
  dsn?: string;
  socket?: any;
}

export class CarbonClient {
  private _dsn: string;
  private _socket: any;

  constructor(properties: CarbonClientOption = {}) {
    this._dsn = properties.dsn;
    this._socket = properties.socket || null;
  }

  public write(metrics, timestamp, cb) {
    this._lazyConnect();

    var lines = '';
    for (var path in metrics) {
      var value = metrics[path];
      lines += [path, value, timestamp].join(' ') + '\n';
    }

    this._socket.write(lines, 'utf-8', cb);
  }

  _lazyConnect() {
    if (this._socket) return;

    var dsn = url.parse(this._dsn);
    var port = parseInt(dsn.port, 10) || 2003;
    var host = dsn.hostname;

    this._socket = LazySocket.createConnection(port, host);
  }

  end() {
    if (this._socket) this._socket.end();
  }
}
