import almariadb from '../src/index.js'

describe('MariaDB update query tests using connection pool', () => {
  const config = {
    host: '127.0.0.1',
    port: 3308,
    database: 'test',
    user: 'test',
    password: 'test',
    logger: { error: null, network: null, query: null }
  }
  almariadb.createPool(config)

  const table = 'plays'
  const values = { wins: 6 }
  const where = { name: `'John'` }

  test(`update() throws error - Promise`, async () => {
    let error, result

    await almariadb
      .update()
      .then((res) => {
        result = res
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(result).toBe(undefined)
        expect(error.message).toBe(
          `[queryUpdate] Not passed table name to be used in query statement.`
        )
        expect(error).toBeInstanceOf(Error)
      })
  })

  test(`update() throws error - Await`, async () => {
    let error, result

    try {
      result = await almariadb.update()
    } catch (err) {
      error = err
    } finally {
      expect(result).toBe(undefined)
      expect(error.message).toBe(
        `[queryUpdate] Not passed table name to be used in query statement.`
      )
      expect(error).toBeInstanceOf(Error)
    }
  })

  test(`update() throws error(where) - Await`, async () => {
    let error, result

    try {
      result = await almariadb.update(table, values)
    } catch (err) {
      error = err
    } finally {
      expect(result).toBe(undefined)
      expect(error.message).toBe(
        `[queryUpdate] Not passed update condition clause to be used in UPDATE query statement.`
      )
      expect(error).toBeInstanceOf(Error)
    }
  })

  test(`update() returns result - Promise`, async () => {
    let error, result

    await almariadb
      .update(table, values, where)
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

  test(`update() returns result - Await`, async () => {
    let error, result

    try {
      result = await almariadb.update(table, values, where)
    } catch (err) {
      error = err
    } finally {
      expect(result.affectedRows).toBe(1)
      expect(error).toBe(undefined)
    }
  })
})
