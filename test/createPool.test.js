import almariadb from '../src/index.js'

describe('MariaDB pool create tests', () => {
  test(`createPool() throws error(miss configuration)`, () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: '',
      logger: { error: null, network: null, query: null }
    }
    let error, pool

    try {
      pool = almariadb.createPool(config)
    } catch (err) {
      error = err
    } finally {
      expect(pool).toBe(undefined)
      expect(error.message).toBe(
        `[createPool] Configuration needed to connect to MariaDB was not provided.`
      )
      expect(error).toBeInstanceOf(Error)
    }
  })

  test(`createPool() returns pool(wrong configuration)`, () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'wrongPassword',
      logger: { error: null, network: null, query: null }
    }
    let error, pool

    try {
      pool = almariadb.createPool(config)
    } catch (err) {
      error = err
    } finally {
      expect(pool.constructor.name).toBe('PoolPromise')
      expect(error).toBe(undefined)
    }
  })

  test(`createPool() returns pool`, () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'test',
      logger: { error: null, network: null, query: null }
    }
    let error, pool

    try {
      pool = almariadb.createPool(config)
    } catch (err) {
      error = err
    } finally {
      expect(pool.constructor.name).toBe('PoolPromise')
      expect(error).toBe(undefined)
    }
  })
})
