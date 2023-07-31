import almariadb from '../src/index.js'

describe('MariaDB query tests when connected using pool', () => {
  const config = {
    host: '127.0.0.1',
    port: 3308,
    database: 'test',
    user: 'test',
    password: 'test',
    logger: { error: null, network: null, query: null },
    usePool: true
  }
  almariadb.createPool(config)

  test(`query() throws error(query error) - Promise`, async () => {
    let error, result

    await almariadb
      .query('SELECT * FROM testTable')
      .then((res) => {
        result = res
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(error).toBeInstanceOf(Error)
        expect(
          error.message.includes(`Table 'test.testtable' doesn't exist`)
        ).toBe(true)
        expect(result).toBe(undefined)
      })
  })

  test(`query() throws error(query error) - Await`, async () => {
    let error, result

    try {
      result = await almariadb.query('SELECT * FROM testTable')
    } catch (err) {
      error = err
    } finally {
      expect(error).toBeInstanceOf(Error)
      expect(
        error.message.includes(`Table 'test.testtable' doesn't exist`)
      ).toBe(true)
      expect(result).toBe(undefined)
    }
  })

  test(`query() returns result - Promise`, async () => {
    let error, result

    await almariadb
      .query('SELECT 1 + 1')
      .then((res) => {
        result = res
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(result).toStrictEqual([{ '1 + 1': 2 }])
        expect(error).toBe(undefined)
      })
  })

  test(`query() returns result - Await`, async () => {
    let error, result

    try {
      result = await almariadb.query('SELECT 1 + 1')
    } catch (err) {
      error = err
    } finally {
      expect(result).toStrictEqual([{ '1 + 1': 2 }])
      expect(error).toBe(undefined)
    }
  })
})
