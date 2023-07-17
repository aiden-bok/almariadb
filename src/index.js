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
const createPool = (custom) => {
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
    mariadb.pool = mariadb.createPool(cfg)
  }

  if (!mariadb.pool) {
    throw new Error(`${tag} 'MariaDB' connection pool not created!`)
  }

  poolInfo()

  return mariadb.pool
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

const almariadb = { createPool, mariadb }

export default almariadb
