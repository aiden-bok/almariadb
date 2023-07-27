import alquery from 'alquery'
import mariadb from 'mariadb'

import { applyConfig, config } from './config.js'

/**
 * Returns `MariaDB` connection pool that created using configuration information.
 *
 * @param {config} [custom] Configuration(connection, etc.) object to apply when useing an `MariaDB`.
 * @throws {Error} Information needed to connect to MariaDB is missing in the configuration information.
 * @returns {mariadb.Pool} `MariaDB` connection pool.
 */
const createPool = (custom) =>
  new Promise((resolve, reject) => {
    const tag = '[createPool]'
    // Apply custom configuration
    const cfg = (custom && applyConfig(custom)) || mariadb.config || config
    if (!cfg.host || !cfg.port || !cfg.user || !cfg.password) {
      reject(
        new Error(
          `${tag} Information needed to connect to MariaDB is missing in the configuration information.`
        )
      )
    }
    mariadb.config = cfg

    if (!mariadb.pool) {
      mariadb.pool = mariadb.createPool(cfg)
    }
    poolInfo()
    resolve(mariadb.pool)
  })

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

  if (mariadb.connection?.isValid()) {
    return mariadb.connection
  }

  if (mariadb.pool) {
    mariadb.connection = await mariadb.pool.getConnection()
    poolInfo()

    if (mariadb.connection?.isValid()) {
      return mariadb.connection
    }
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
    createPool(cfg)
    return await getConnection()
  } else {
    mariadb.connection = await mariadb.createConnection(cfg)

    if (mariadb.connection?.isValid()) {
      return mariadb.connection
    } else {
      throw new Error(`${tag} 'MariaDB' not connected!`)
    }
  }
}

/**
 * Returns result after executing `INSERT` query statement.
 *
 * @param {String} table Table name to use in query statement.
 * @param {Object|String|Array} values Values object that consisting of column names and values to add to table. Or array of lists of values to add to the table.
 * @throws {Error} Not passed table name to be used in query statement!
 * @throws {Error} Not passed object consisting of column and value to be used in INSERT query statement!
 * @throws {Error} Object consisting of columns and values for use in an INSERT query statement was specified incorrectly!
 * @returns {mixed} Result of executing `INSERT` query statement.
 */
const insert = async (table, values) => {
  return await query(alquery.queryInsert(table, values))
}

/**
 * Output `MariaDB` connection pool information.
 */
const poolInfo = () => {
  const tag = '[poolInfo]'

  if (!mariadb.pool) {
    throw new Error(`${tag} 'MariaDB' connection pool not created!`)
  } else {
    let message = `${tag} MariaDB connections - `
    message += `active: ${mariadb.pool.activeConnections()} / `
    message += `idle: ${mariadb.pool.idleConnections()} / `
    message += `total: ${mariadb.pool.totalConnections()}`
    if (mariadb.config?.logger?.query) {
      mariadb.config.logger.query(message)
    } else {
      console.log(message)
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
    connection.destroy && connection.destroy()
    connection.release && connection.release()
    connection.end && connection.end()
  }
}

/**
 * Returns result after executing `SELECT` query statement.
 *
 * @param {String|Array|Object} table Table name to use in query statement.
 * @param {Array|String|Object} [columns=null] Columns to be used in query statement.
 * @param {String|Array|Object} [where=null] Where condition to be used in query statement.
 * @param {String|Array|Object} [order=null] Order by clause to be used in query statement.
 * @param {Number} [limit=0] Number of rows to return to be used in query statement. If `0` no limit in used.
 * @throws {Error} Not passed table name to be used in query statement!
 * @throws {Error} Table name to use in the query statement is not specified!
 * @returns {mixed} Result of executing `SELECT` query statement.
 */
const select = async (
  table,
  columns = null,
  where = null,
  order = null,
  limit = 0
) => {
  return await query(alquery.querySelect(table, columns, where, order, limit))
}

/**
 * Returns result after executing `SELECT` query statement using group.
 *
 * @param {String|Array|Object} table Table name to use in query statement.
 * @param {Array|String|Object} [columns=null] Columns to be used in query statement.
 * @param {String|Array|Object} [where=null] Where condition to be used in query statement.
 * @param {String|Array|Object} [group=null] Group by clause to be used in query statement.
 * @param {String} [having=null] Having condition to be used in group by clause of query statement.
 * @param {String|Array|Object} [order=null] Order by clause to be used in query statement.
 * @param {Number} [limit=0] Number of rows to return to be used in query statement. If `0` no limit in used.
 * @throws {Error} Not passed table name to be used in query statement!
 * @throws {Error} Table name to use in the query statement is not specified!
 * @returns {mixed} Result of executing `SELECT` query statement using group.
 */
const selectGroup = async (
  table,
  columns = null,
  where = null,
  group = null,
  having = null,
  order = null,
  limit = 0
) => {
  return await query(
    alquery.querySelectGroup(table, columns, where, group, having, order, limit)
  )
}

/**
 * Returns result after executing `SELECT` query statement using table join.
 *
 * @param {String|Array|Object} table Table name to use in query statement.
 * @param {String} [type=null] Join type to be used in table join query statement.
 * @param {String|Array} [join=null] Table name of joined target table to use in join query statement.
 * @param {String} [on=null] Constraint for to use table join.
 * @param {Array|String|Object} [columns=null] Columns to be used in query statement.
 * @param {String|Array|Object} [where=null] Where condition to be used in query statement.
 * @param {String|Array|Object} [order=null] Order by clause to be used in query statement.
 * @param {Number} [limit=0] Number of rows to return to be used in query statement. If `0` no limit in used.
 * @throws {Error} Not passed table name to be used in query statement!
 * @returns {mixed} Result of executing `SELECT` query statement using table join.
 */
const selectJoin = async (
  table,
  type = null,
  join = null,
  on = null,
  columns = null,
  where = null,
  order = null,
  limit = 0
) => {
  return await query(
    alquery.querySelectJoin(table, type, join, on, columns, where, order, limit)
  )
}

/**
 * Returns result after executing `SELECT` query statement using table join and group.
 *
 * @param {String|Array|Object} table Table name to use in query statement.
 * @param {String} [type=null] Join type to be used in table join query statement.
 * @param {String|Array} [join=null] Table name of joined target table to use in join query statement.
 * @param {String} [on=null] Constraint for to use table join.
 * @param {Array|String|Object} [columns=null] Columns to be used in query statement.
 * @param {String|Array|Object} [where=null] Where condition to be used in query statement.
 * @param {String|Array|Object} [group=null] Group by clause to be used in query statement.
 * @param {String} [having=null] Having condition to be used in group by clause of query statement.
 * @param {String|Array|Object} [order=null] Order by clause to be used in query statement.
 * @param {Number} [limit=0] Number of rows to return to be used in query statement. If `0` no limit in used.
 * @throws {Error} Not passed table name to be used in query statement!
 * @throws {Error} Table name to use in the query statement is not specified!
 * @returns {mixed} Result of executing `SELECT` query statement using table join and group.
 */
const selectJoinGroup = async (
  table,
  type = null,
  join = null,
  on = null,
  columns = null,
  where = null,
  group = null,
  having = null,
  order = null,
  limit = 0
) => {
  return await query(
    alquery.querySelectJoinGroup(
      table,
      type,
      join,
      on,
      columns,
      where,
      group,
      having,
      order,
      limit
    )
  )
}

/**
 * Returns result after executing `UPDATE` query statement.
 *
 * @param {String} table Table name to use in query statement.
 * @param {Object|Array|String} values Values object that consisting of column names and values to be used in `UPDATE` query statement. Or array of lists of values to update to the table.
 * @param {String|Array|Object} where Where condition to be used in query statement.
 * @throws {Error} Not passed table name to be used in query statement!
 * @throws {Error} Not passed update condition clause to be used in UPDATE query statement!
 * @throws {Error} Not passed object consisting of column and value to be used in UPDATE query statement!
 * @throws {Error} Object consisting of columns and values for use in an UPDATE query statement was specified incorrectly!
 * @returns {mixed} Result of executing `UPDATE` query statement.
 */
const update = async (table, values, where) => {
  return await query(alquery.queryUpdate(table, values, where))
}

const almariadb = {
  createPool,
  getConnection,
  insert,
  mariadb,
  poolInfo,
  query,
  select,
  selectGroup,
  selectJoin,
  selectJoinGroup,
  update
}

export default almariadb
