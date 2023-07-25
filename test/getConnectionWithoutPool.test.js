import almariadb from '../src/index.js'

describe('MariaDB connection tests using created pool by createPool()', () => {
  test(`getConnection() throws error`, async () => {
    let error
    try {
      const config = {
        host: '127.0.0.1',
        port: 3308,
        database: 'test',
        user: 'test',
        password: '',
        usePool: false
      }
      await almariadb.getConnection(config)
    } catch (err) {
      error = err
    } finally {
      expect(error.message).toBe(
        `[getConnection] Information needed to connect to 'MariaDB' is missing in the configuration information.`
      )
      expect(error).toBeInstanceOf(Error)
    }
  })

  test(`getConnection() throws error(wrong password)`, async () => {
    let error
    try {
      const config = {
        host: '127.0.0.1',
        port: 3308,
        database: 'test',
        user: 'test',
        password: 'test1234',
        logger: { error: null, network: null, query: null },
        usePool: false
      }
      await almariadb.getConnection(config)
    } catch (err) {
      error = err
    } finally {
      expect(error.message.includes('Access denied for user')).toBe(true)
      expect(error).toBeInstanceOf(Error)
    }
  })

  test(`getConnection() without pool returns connection(Promise)`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'test',
      logger: { error: null, network: null, query: null },
      usePool: false
    }
    let connection, error
    await almariadb
      .getConnection(config)
      .then((conn) => {
        connection = conn
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(connection.isValid()).toBe(true)
        expect(error).toBe(undefined)
      })
  })

  test(`getConnection() without pool returns connection(Await)`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'test',
      logger: { error: null, network: null, query: null },
      usePool: false
    }
    let conn = await almariadb.getConnection(config)
    expect(conn.isValid()).toBe(true)
    conn = await almariadb.getConnection()
    expect(conn.isValid()).toBe(true)
  })
})
