import alquery from 'alquery'
import mariadb from 'mariadb'

import { applyConfig, config } from './config.js'

/**
 * Executes `MariaDB` procedure or function and returns results.
 *
 * @param {String} target `MariaDB` procedure or function name to execute.
 * @param {Array|Object|String} [params=null] Parameters to pass when executing a `MariaDB` procedure or function.
 * @throws {Error} Configuration needed to connect to MariaDB was not provided.
 * @throws {Error} MariaDB not connected.
 * @returns {mixed} Result of run query statement.
 */
const call = async (target, params = null) => {
  const { query, param } = alquery.queryCall(target, params)
  return await queryWithParam(query, param)
}

/**
 * Returns `MariaDB` connection pool that created using configuration information.
 *
 * @param {config} [custom] Configuration(connection, etc.) object to apply when useing an `MariaDB`.
 * @throws {Error} Configuration needed to connect to MariaDB was not provided.
 * @returns {PoolPromise} `MariaDB` connection pool.
 */
const createPool = (custom) => {
  const tag = '[createPool]'

  // Apply custom configuration
  const cfg = (custom && applyConfig(custom)) || mariadb.config || config
  if (!cfg.host || !cfg.port || !cfg.user || !cfg.password) {
    const err = `${tag} Configuration needed to connect to MariaDB was not provided.`
    throw new Error(err)
  }
  mariadb.config = cfg

  if (!mariadb.pool) {
    mariadb.pool = mariadb.createPool(cfg)
  }
  poolInfo()

  return mariadb.pool
}

/**
 * Return the `MariaDB` connection object after connecting to `MariaDB`.
 *
 * @param {config} [custom] Configuration(connection, etc.) object to apply when useing an `MariaDB`.
 * @throws {Error} Failed to get connection from MariaDB pool.
 * @throws {Error} Configuration needed to connect to MariaDB was not provided.
 * @throws {Error} Failed to create MariaDB connection object.
 * @returns {ConnectionPromise} `MariaDB` connection object.
 */
const getConnection = async (custom) => {
  const tag = '[getConnection]'

  if (mariadb.connection?.isValid()) {
    return mariadb.connection
  }

  if (mariadb.pool) {
    // eslint-disable-next-line no-useless-catch
    try {
      mariadb.connection = await mariadb.pool.getConnection()

      if (mariadb.connection?.isValid()) {
        poolInfo()
        return mariadb.connection
      } else {
        const err = `${tag} Failed to get connection from MariaDB pool.`
        throw new Error(err)
      }
    } catch (error) {
      throw error
    }
  }

  // Apply custom configuration
  const cfg = (custom && applyConfig(custom)) || mariadb.config || config
  if (!cfg.host || !cfg.port || !cfg.user || !cfg.password) {
    const err = `${tag} Configuration needed to connect to MariaDB was not provided.`
    throw new Error(err)
  }
  mariadb.config = cfg

  if (cfg.usePool === true) {
    createPool(cfg)
    return await getConnection()
  } else {
    // eslint-disable-next-line no-useless-catch
    try {
      const connection = await mariadb.createConnection(cfg)

      if (connection.isValid()) {
        mariadb.connection = connection
        return mariadb.connection
      } else {
        const err = `${tag} Failed to create MariaDB connection object.`
        throw new Error(err)
      }
    } catch (error) {
      throw error
    }
  }
}

/**
 * Returns result after executing `INSERT` query statement.
 *
 * @param {String} table Table name to use in query statement.
 * @param {Object|String|Array} values Values object that consisting of column names and values to add to table. Or array of lists of values to add to the table.
 * @throws {Error} Not passed table name to be used in query statement.
 * @throws {Error} Not passed object consisting of column and value to be used in INSERT query statement.
 * @throws {Error} Object consisting of columns and values for use in an INSERT query statement was specified incorrectly.
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
    throw new Error(`${tag} MariaDB connection pool not created.`)
  } else {
    let message = `${tag} MariaDB connections - `
    message += `active: ${mariadb.pool.activeConnections()} / `
    message += `idle: ${mariadb.pool.idleConnections()} / `
    message += `total: ${mariadb.pool.totalConnections()}`
    if (mariadb.config?.logger?.query) {
      mariadb.config.logger.query(message)
    }
  }
}

/**
 * Run query statement and returns result.
 *
 * @param {String} query Query statement to be run.
 * @throws {Error} Configuration needed to connect to MariaDB was not provided.
 * @throws {Error} MariaDB not connected.
 * @returns {mixed} Result of run query statement.
 */
const query = async (query) => {
  const tag = '[query]'

  if (mariadb.pool) {
    // eslint-disable-next-line no-useless-catch
    try {
      return await mariadb.pool.query(query)
    } catch (error) {
      throw error
    }
  } else {
    const connection = await getConnection()
    if (!connection || !connection?.isValid()) {
      throw new Error(`${tag} MariaDB not connected.`)
    }

    try {
      return await connection.query(query)
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error
    } finally {
      connection.release && connection.release()
      connection.end && connection.end()
    }
  }
}

/**
 * Run query statement with parameters and returns result.
 *
 * @param {String} query Query statement to be run.
 * @param {Array} [params=null] Parameters to be passed to the query statement.
 * @throws {Error} Configuration needed to connect to MariaDB was not provided.
 * @throws {Error} MariaDB not connected.
 * @returns {mixed} Result of run query statement.
 */
const queryWithParam = async (query, params = null) => {
  const tag = '[queryWithParam]'

  if (mariadb.pool) {
    // eslint-disable-next-line no-useless-catch
    try {
      return await mariadb.pool.query(query, params)
    } catch (error) {
      throw error
    }
  } else {
    const connection = await getConnection()
    if (!connection || !connection?.isValid()) {
      throw new Error(`${tag} MariaDB not connected.`)
    }

    try {
      return await connection.query(query, params)
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error
    } finally {
      connection.release && connection.release()
      connection.end && connection.end()
    }
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
 * @throws {Error} Not passed table name to be used in query statement.
 * @throws {Error} Table name to use in the query statement is not specified.
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
 * @throws {Error} Not passed table name to be used in query statement.
 * @throws {Error} Table name to use in the query statement is not specified.
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
 * @throws {Error} Not passed table name to be used in query statement.
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
 * @throws {Error} Not passed table name to be used in query statement.
 * @throws {Error} Table name to use in the query statement is not specified.
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
 * @throws {Error} Not passed table name to be used in query statement.
 * @throws {Error} Not passed update condition clause to be used in UPDATE query statement.
 * @throws {Error} Not passed object consisting of column and value to be used in UPDATE query statement.
 * @throws {Error} Object consisting of columns and values for use in an UPDATE query statement was specified incorrectly.
 * @returns {mixed} Result of executing `UPDATE` query statement.
 */
const update = async (table, values, where) => {
  return await query(alquery.queryUpdate(table, values, where))
}

const almariadb = {
  call,
  createPool,
  getConnection,
  insert,
  mariadb,
  poolInfo,
  query,
  queryWithParam,
  select,
  selectGroup,
  selectJoin,
  selectJoinGroup,
  update
}

export default almariadb
