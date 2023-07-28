import almariadb from '../src/index.js'

describe('MariaDB connection tests without pool', () => {
  test(`getConnection() throws error(miss configuration) - Promise`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: '',
      connectTimeout: 1000,
      logger: { error: null, network: null, query: null },
      usePool: false
    }
    let connection, error

    await almariadb
      .getConnection(config)
      .then((con) => {
        connection = con
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(connection).toBe(undefined)
        expect(error.message).toBe(
          `[getConnection] Configuration needed to connect to MariaDB was not provided.`
        )
        expect(error).toBeInstanceOf(Error)
      })
  })

  test(`getConnection() throws error(miss configuration) - Await`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: '',
      connectTimeout: 1000,
      logger: { error: null, network: null, query: null },
      usePool: false
    }
    let connection, error

    try {
      connection = await almariadb.getConnection(config)
    } catch (err) {
      error = err
    } finally {
      expect(connection).toBe(undefined)
      expect(error.message).toBe(
        `[getConnection] Configuration needed to connect to MariaDB was not provided.`
      )
      expect(error).toBeInstanceOf(Error)
    }
  })

  test(`getConnection() throws error(wrong configuration) - Promise`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'wrongPassword',
      connectTimeout: 1000,
      logger: { error: null, network: null, query: null },
      usePool: false
    }
    let connection, error

    await almariadb
      .getConnection(config)
      .then((con) => {
        connection = con
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(connection).toBe(undefined)
        expect(error.constructor.name === 'SqlError').toBe(true)
        expect(error).toBeInstanceOf(Error)
        connection?.end && connection.end()
      })
  })

  test(`getConnection() throws error(wrong configuration) - Await`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'wrongPassword',
      connectTimeout: 1000,
      logger: { error: null, network: null, query: null },
      usePool: false
    }
    let connection, error

    try {
      connection = await almariadb.getConnection(config)
    } catch (err) {
      error = err
    } finally {
      expect(connection).toBe(undefined)
      expect(error.constructor.name === 'SqlError').toBe(true)
      expect(error).toBeInstanceOf(Error)
      connection?.end && connection.end()
    }
  })

  test(`getConnection() returns connection - Promise`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'test',
      connectTimeout: 1000,
      logger: { error: null, network: null, query: null },
      usePool: false
    }
    let connection, error

    await almariadb
      .getConnection(config)
      .then((con) => {
        connection = con
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(connection.constructor.name === 'ConnectionPromise').toBe(true)
        expect(error).toBe(undefined)
        connection?.end && connection.end()
      })
  })

  test(`getConnection() returns connection - Await`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'test',
      connectTimeout: 1000,
      logger: { error: null, network: null, query: null },
      usePool: false
    }
    let connection, error

    try {
      connection = await almariadb.getConnection(config)
    } catch (err) {
      error = err
    } finally {
      expect(connection.constructor.name === 'ConnectionPromise').toBe(true)
      expect(error).toBe(undefined)
      // connection?.end && connection.end()
    }
  })

  test(`getConnection() returns connection - Await reuse`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'test',
      connectTimeout: 1000,
      logger: { error: null, network: null, query: null },
      usePool: false
    }
    let connection, error

    try {
      connection = await almariadb.getConnection(config)
    } catch (err) {
      error = err
    } finally {
      expect(connection.constructor.name === 'ConnectionPromise').toBe(true)
      expect(error).toBe(undefined)
      connection?.end && connection.end()
    }
  })
})
