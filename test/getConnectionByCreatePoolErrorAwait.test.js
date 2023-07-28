import almariadb from '../src/index.js'

describe('MariaDB connection tests using created Pool by createPool()', () => {
  test(`getConnection() throws error(wrong configuration) - Await`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'wrongPassword',
      acquireTimeout: 1000,
      logger: { error: null, network: null, query: null }
    }
    let connection, error

    try {
      almariadb.createPool(config)
      connection = await almariadb.getConnection()
    } catch (err) {
      error = err
    } finally {
      expect(connection).toBe(undefined)
      expect(error.constructor.name === 'SqlError').toBe(true)
      expect(error).toBeInstanceOf(Error)
    }
  })
})
