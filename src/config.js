/**
 * Configuration(connection, etc.) information object for `MariaDB`.
 *
 * @see https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/connection-options.md
 *
 * @namespace
 */
export const config = {
  /**
   * @property {String} host IP address or DNS of database server.
   */
  host: 'localhost',
  /**
   * @property {Number} host Database server port number.
   */
  port: 3306,
  /**
   * @property {String} database Default database to use when establishing the connection.
   */
  database: '',
  /**
   * @property {String} user User to access database.
   */
  user: '',
  /**
   * @property {String} password User password.
   */
  password: '',
  /**
   * @property {Number} connectionTimeout Connection timeout(in milliseconds).
   */
  connectionTimeout: 1000,
  /**
   * @property {Boolean} compress Compress exchanges with database using gzip. This can give you better performance when accessing a database in a different location.
   */
  compress: false,
  /**
   * @property {Boolean} rowsAsArray Return result-sets as array, rather than a JSON object. This is a faster way to get results.
   */
  rowsAsArray: false,
  /**
   * @property {mixed} logger Permit custom logger configuration.
   */
  logger: {
    error: (message) => console.error(message),
    network: (message) => console.info(message),
    query: (message) => console.debug(message)
  },
  /**
   * @property {Number} acquireTimeout Timeout to get a new connection from **pool**(in milliseconds).
   */
  acquireTimeout: 10000,
  /**
   * @property {Number} connectionLimit Maximum number of connection in **pool**.
   */
  connectionLimit: 10,
  /**
   * @property {Number} idleTimeout Indicate idle time after which a **pool** connection is released(in seconds). 0 means never release.
   * Value must be lower than [@@wait_timeout](https://mariadb.com/kb/en/library/server-system-variables/#wait_timeout).
   */
  idleTimeout: 1800,
  /**
   * @property {Number} initializationTimeout **Pool** will retry creating connection in loop, emitting 'error' event when reaching this timeout(in milliseconds).
   */
  initializationTimeout: 30000,
  /**
   * @property {Number} leakDetectionTimeout Permit to indicate a timeout to log connection borrowed from **pool**.
   * When a connection is borrowed from **pool** and this timeout is reached, a message will be logged to console indicating a possible connection leak.
   * Another message will tell if the possible logged leak has been released.
   * A value of 0(default) meaning leak detection is disable
   */
  leakDetectionTimeout: 0,
  /**
   * @property {Number} minDelayValidation When asking a connection to **pool**, the **pool** will validate the connection state.
   * "minDelayValidation" permits disabling this validation if the connection has been borrowed recently avoiding useless verifications in case of frequent reuse of connections.
   * 0 means validation is done each time the connection is asked(in milliseconds).
   */
  minDelayValidation: 500,
  /**
   * @property {Boolean} noControlAfterUse After giving back connection to **pool**(connection.end) connector will reset or rollback connection to ensure a valid state.
   * This option permit to disable those controls.
   */
  noControlAfterUse: false,
  /**
   * @property {Boolean} resetAfterUse When a connection is given back to **pool**, reset the connection if the server allows it.
   * If disabled or server version doesn't allows reset, **pool** will only rollback open transaction if any.
   */
  resetAfterUse: true,
  /**
   * @property {String} timezone Timezone to use in `MariaDB`.
   */
  timezone: 'Asia/Seoul',
  /**
   * @property {Boolean} usePool Whether to use `pool` for `MariaDB` connections.
   */
  usePool: true
}

/**
 * Returns an `almariadb` configuration object(`config`) that applied the user-defined configuration object.
 *
 * @param {config} [custom={}] User-defined configuration.
 * @param {config} [original=config] Default configuration.
 * @returns {config} Custom configuration.
 */
export const applyConfig = (custom = {}, original = config) => {
  for (const key in original) {
    if (original[key]?.constructor.name === 'Object') {
      if (custom[key]?.constructor.name === 'Object') {
        custom[key] = applyConfig(custom[key] || {}, original[key])
      } else {
        custom[key] = original[key]
      }
    } else {
      custom[key] = custom[key] !== undefined ? custom[key] : original[key]
    }
  }

  return custom
}
