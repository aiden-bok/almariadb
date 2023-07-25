import almariadb from '../src/index.js'

describe('MariaDB connection tests using auto created pool by config', () => {
  test(`getConnection() returns connection`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'test',
      logger: { error: null, network: null, query: null }
    }
    const connection = await almariadb.getConnection(config)
    expect(connection.isValid()).toBe(true)
  })
})
