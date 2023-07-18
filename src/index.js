import mariadb from 'mariadb'

import { applyConfig, config } from './config.js'

/**
 * Returns `MariaDB` connection pool that created using configuration information.
 *
 * @param {config} [custom] Configuration(connection, etc.) object to apply when useing an `MariaDB`.
 * @throws {Error} Information needed to connect to 'MariaDB' is missing in the configuration information.
 * @throws {Error} 'MariaDB' connection pool not created!
 * @returns {mariadb.Pool} `MariaDB` connection pool.
 */
const createPool = async (custom) => {
  const tag = '[createPool]'

  // Apply custom configuration
  const cfg = (custom && applyConfig(custom)) || mariadb.config || config

  if (!cfg.host || !cfg.port || !cfg.user || !cfg.password) {
    throw new Error(
      `${tag} Information needed to connect to 'MariaDB' is missing in the configuration information.`
    )
  }
  mariadb.config = cfg

  if (!mariadb.pool) {
    mariadb.pool = await mariadb.createPool(cfg)
  }

  if (!mariadb.pool) {
    throw new Error(`${tag} 'MariaDB' connection pool not created!`)
  }

  poolInfo()

  return mariadb.pool
}

/**
 * Return the `MariaDB` connection object after connecting to `MariaDB`.
 *
 * @param {config} [custom] Configuration(connection, etc.) object to apply when useing an `MariaDB`.
 * @throws {Error} Information needed to connect to 'MariaDB' is missing in the configuration information.
 * @throws {Error} 'MariaDB' connection pool not created!
 * @throws {Error} 'MariaDB' not connected!
 * @returns {Promise<mariadb.PoolConnection>|Promise<mariadb.Connection>} `MariaDB` connection object.
 */
const getConnection = async (custom) => {
  const tag = '[getConnection]'

  if (mariadb.pool) {
    mariadb.connection = await mariadb.pool.getConnection()
    poolInfo()

    if (mariadb.connection.isValid()) {
      return mariadb.connection
    }
  }

  if (mariadb.connection && mariadb.connection.isValid()) {
    return mariadb.connection
  }

  // Apply custom configuration
  const cfg = (custom && applyConfig(custom)) || mariadb.config || config

  if (!cfg.host || !cfg.port || !cfg.user || !cfg.password) {
    throw new Error(
      `${tag} Information needed to connect to 'MariaDB' is missing in the configuration information.`
    )
  }
  mariadb.config = cfg

  if (cfg.usePool === true) {
    await createPool()
    return await getConnection()
  } else {
    mariadb.connection = await mariadb.createConnection(cfg)

    if (mariadb.connection && mariadb.connection.isValid()) {
      return mariadb.connection
    } else {
      throw new Error(`${tag} 'MariaDB' not connected!`)
    }
  }
}

/**
 * Output `MariaDB` connection pool information.
 */
const poolInfo = () => {
  const tag = '[poolInfo]'

  if (!mariadb.pool) {
    throw new Error(`${tag} 'MariaDB' connection pool not created!`)
  } else {
    if (mariadb.config?.logger?.network) {
      mariadb.config.logger.network(
        `${tag} MariaDB connections - ` +
          `active: ${mariadb.pool.activeConnections()} / ` +
          `idle: ${mariadb.pool.idleConnections()} / ` +
          `total: ${mariadb.pool.totalConnections()}`
      )
    }
  }
}

/**
 * Run query statement and returns result.
 *
 * @param {String} query Query statement to be run.
 * @throws {Error} Information needed to connect to 'MariaDB' is missing in the configuration information.
 * @throws {Error} MariaDB' not connected!
 * @returns {mixed} Result of run query statement.
 */
const query = async (query) => {
  const tag = '[query]'

  const connection = await getConnection()
  if (!connection || !connection.isValid()) {
    throw new Error(`${tag} 'MariaDB' not connected!`)
  }

  try {
    return await connection.query(query)
  } catch (error) {
    throw new Error(`${tag} ${error.toString()}`)
  } finally {
    connection.release && connection.release()
    connection.end && connection.end()
  }
}

const almariadb = { createPool, getConnection, mariadb, query }

export default almariadb
