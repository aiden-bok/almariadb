import almariadb from '../src/index.js'

describe('MariaDB query tests when do not connected', () => {
  test(`query() throws error - Promise`, async () => {
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
          error.message.includes(
            `[getConnection] Configuration needed to connect to MariaDB was not provided.`
          )
        ).toBe(true)
        expect(result).toBe(undefined)
      })
  })

  test(`query() throws error - Await`, async () => {
    let error, result

    try {
      result = await almariadb.query('SELECT * FROM testTable')
    } catch (err) {
      error = err
    } finally {
      expect(error).toBeInstanceOf(Error)
      expect(
        error.message.includes(
          `[getConnection] Configuration needed to connect to MariaDB was not provided.`
        )
      ).toBe(true)
      expect(result).toBe(undefined)
    }
  })
})

describe('MariaDB query tests when do not connected using pool', () => {
  test(`query() throws error - Promise`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'wrongPassword',
      logger: { error: null, network: null, query: null },
      acquireTimeout: 1000,
      initializationTimeout: 1000,
      usePool: true
    }
    let error, result

    almariadb.createPool(config)
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
        expect(error.constructor.name === 'SqlError').toBe(true)
        expect(result).toBe(undefined)
      })
  })

  test(`query() throws error - Await`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'wrongPassword',
      logger: { error: null, network: null, query: null },
      acquireTimeout: 1000,
      initializationTimeout: 1000,
      usePool: true
    }
    let error, result

    almariadb.createPool(config)
    try {
      result = await almariadb.query('SELECT * FROM testTable')
    } catch (err) {
      error = err
    } finally {
      expect(error).toBeInstanceOf(Error)
      expect(error.constructor.name === 'SqlError').toBe(true)
      expect(result).toBe(undefined)
    }
  })
})
