import { CarbonClient } from "./CarbonClient";

export class GraphiteClient {
  constructor(private _carbon: CarbonClient) {}

  static createClient(carbonDsn) {
    var client = new this(new CarbonClient({ dsn: carbonDsn }));
    return client;
  }

  static flatten(obj, flat?, prefix?) {
    flat = flat || {};
    prefix = prefix || "";

    for (var key in obj) {
      var value = obj[key];
      if (typeof value === "object") {
        this.flatten(value, flat, prefix + key + ".");
      } else {
        flat[prefix + key] = value;
      }
    }

    return flat;
  }

  static appendTags(flatMetrics, tags) {
    let tagSuffix = "";
    let res = {};

    let flatTags = GraphiteClient.flatten(tags);
    for (var key in flatTags) {
      tagSuffix += ";" + key + "=" + flatTags[key];
    }

    for (var k in flatMetrics) {
      res[k + tagSuffix] = flatMetrics[k];
    }

    return res;
  }

  /**
   * Writes the given metrics to the underlying plaintext socket to Graphite
   *
   * If no timestamp is given, the current Unix epoch is used (second precision).
   *
   * If a timestamp is provided, it must have a millisecond precision, otherwise
   * Graphite will probably reject the data.
   *
   * @param {object} metrics
   * @param {object} timestamp
   * @param {function} cb
   */
  write(metrics, timestamp, cb) {
    if (typeof timestamp === "function") {
      cb = timestamp;
      timestamp = null;
    }

    // default timestamp to now
    timestamp = timestamp || Date.now();

    // cutting timestamp for precision up to the second
    timestamp = Math.floor(timestamp / 1000);

    this._carbon.write(GraphiteClient.flatten(metrics), timestamp, cb);
  }

  writeTagged(metrics, tags, timestamp, cb) {
    const taggedMetrics = GraphiteClient.appendTags(
      GraphiteClient.flatten(metrics),
      tags
    );
    this.write(taggedMetrics, timestamp, cb);
  }

  end() {
    this._carbon.end();
  }
}
