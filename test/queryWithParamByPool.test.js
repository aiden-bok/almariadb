import almariadb from '../src/index.js'

describe('MariaDB query with parameters tests when connected using pool', () => {
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

  test(`queryWithParam() throws error(query error) - Promise`, async () => {
    let error, result

    await almariadb
      .queryWithParam('SELECT * FROM testTable')
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

  test(`queryWithParam() throws error(query error) - Await`, async () => {
    let error, result

    try {
      result = await almariadb.queryWithParam('SELECT * FROM testTable')
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

  test(`queryWithParam() returns result - Promise`, async () => {
    let error, result

    await almariadb
      .queryWithParam('SELECT 1 + 1')
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

  test(`queryWithParam() returns result - Await`, async () => {
    let error, result

    try {
      result = await almariadb.queryWithParam('SELECT 1 + 1')
    } catch (err) {
      error = err
    } finally {
      expect(result).toStrictEqual([{ '1 + 1': 2 }])
      expect(error).toBe(undefined)
    }
  })

  test(`queryWithParam() returns result(query with parameters) - Await`, async () => {
    let error, result
    const query = 'SELECT * FROM plays WHERE name = ?'
    const parameters = ['Robert']

    try {
      result = await almariadb.queryWithParam(query, parameters)
    } catch (err) {
      error = err
    } finally {
      expect(result).toStrictEqual([
        {
          name: 'Robert',
          plays: 22,
          wins: 8
        }
      ])
      expect(error).toBe(undefined)
    }
  })

  test(`queryWithParam() returns result(procedure with parameters) - Await`, async () => {
    let error, result
    const query = 'CALL simple_proc(?)'
    const parameters = [20]

    try {
      result = await almariadb.queryWithParam(query, parameters)
    } catch (err) {
      error = err
    } finally {
      expect(result[0]).toStrictEqual([{ 'param1 * param1': 400n }])
      expect(error).toBe(undefined)
    }
  })
})
