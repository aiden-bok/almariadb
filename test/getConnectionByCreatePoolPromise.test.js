import almariadb from '../src/index.js'

describe('MariaDB connection tests using created Pool by createPool()', () => {
  test(`getConnection() returns connection - Promise`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'test',
      logger: { error: null, network: null, query: null }
    }
    let connection, error

    almariadb.createPool(config)
    await almariadb
      .getConnection()
      .then((con) => {
        connection = con
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(connection.constructor.name === 'ConnectionPromise').toBe(true)
        expect(error).toBe(undefined)
      })
  })
})
