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
   * @property {Number} connectionTimeout Connection timeout in milliseconds.
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
  }
}
