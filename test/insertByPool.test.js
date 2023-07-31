import almariadb from '../src/index.js'

describe('MariaDB insert query tests using connection pool', () => {
  const config = {
    host: '127.0.0.1',
    port: 3308,
    database: 'test',
    user: 'test',
    password: 'test',
    logger: { error: null, network: null, query: null }
  }
  almariadb.createPool(config)

  const table = 'test'
  const values = { name: 'test' }

  test(`insert() throws error - Promise`, async () => {
    let error, result

    await almariadb
      .insert()
      .then((res) => {
        result = res
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(result).toBe(undefined)
        expect(error.message).toBe(
          `[queryInsert] Not passed table name to be used in query statement!`
        )
        expect(error).toBeInstanceOf(Error)
      })
  })

  test(`insert() throws error - Await`, async () => {
    let error, result

    try {
      result = await almariadb.insert()
    } catch (err) {
      error = err
    } finally {
      expect(result).toBe(undefined)
      expect(error.message).toBe(
        `[queryInsert] Not passed table name to be used in query statement!`
      )
      expect(error).toBeInstanceOf(Error)
    }
  })

  test(`insert() returns result - Promise`, async () => {
    let error, result

    await almariadb
      .insert(table, values)
      .then((res) => {
        result = res
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(result.affectedRows).toBe(1)
        expect(error).toBe(undefined)
      })
  })

  test(`insert() returns result - Await`, async () => {
    let error, result

    try {
      result = await almariadb.insert(table, values)
    } catch (err) {
      error = err
    } finally {
      expect(result.affectedRows).toBe(1)
      expect(error).toBe(undefined)
    }
  })
})
