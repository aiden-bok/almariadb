import almariadb from '../src/index.js'

describe('MariaDB select query tests using connection pool', () => {
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
  const columns = ['name', 'plays']
  const where = { name: `"John"` }

  test(`select() throws error - Promise`, async () => {
    let error, result

    await almariadb
      .select()
      .then((res) => {
        result = res
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(result).toBe(undefined)
        expect(error.message).toBe(
          `[parseTable] Not passed table name to be used in query statement!`
        )
        expect(error).toBeInstanceOf(Error)
      })
  })

  test(`select() throws error - Await`, async () => {
    let error, result

    try {
      result = await almariadb.select()
    } catch (err) {
      error = err
    } finally {
      expect(result).toBe(undefined)
      expect(error.message).toBe(
        `[parseTable] Not passed table name to be used in query statement!`
      )
      expect(error).toBeInstanceOf(Error)
    }
  })

  test(`select() returns result - Promise`, async () => {
    let error, result

    await almariadb
      .select(table, columns, where)
      .then((res) => {
        result = res
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(result).toStrictEqual([{ name: 'John', plays: 20 }])
        expect(error).toBe(undefined)
      })
  })

  test(`select() returns result - Await`, async () => {
    let error, result

    try {
      result = await almariadb.select(table, columns, where)
    } catch (err) {
      error = err
    } finally {
      expect(result).toStrictEqual([{ name: 'John', plays: 20 }])
      expect(error).toBe(undefined)
    }
  })
})
