import almariadb from '../src/index.js'

describe('MariaDB connection tests using created pool by createPool()', () => {
  test(`getConnection() using pool returns connection`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'test',
      logger: { error: null, network: null, query: null }
    }
    almariadb.createPool(config)
    const conn = await almariadb.getConnection()
    expect(conn.isValid()).toBe(true)
  })
})
