import almariadb from '../src/index.js'

describe('MariaDB pool create tests', () => {
  test(`createPool() throws error(miss configuration) - Promise`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: ''
    }
    let error, pool

    await almariadb
      .createPool(config)
      .then((p) => {
        pool = p
      })
      .catch((e) => {
        error = e
      })
      .finally(() => {
        expect(pool).toBe(undefined)
        expect(error.message).toBe(
          `[createPool] Information needed to connect to MariaDB is missing in the configuration information.`
        )
        expect(error).toBeInstanceOf(Error)
      })
  })

  test(`createPool() throws error(miss configuration) - Await`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: ''
    }
    let error, pool

    try {
      pool = await almariadb.createPool(config)
    } catch (err) {
      error = err
    } finally {
      expect(pool).toBe(undefined)
      expect(error.message).toBe(
        `[createPool] Information needed to connect to MariaDB is missing in the configuration information.`
      )
      expect(error).toBeInstanceOf(Error)
    }
  })

  test(`createPool() returns pool(wrong configuration) - Promise`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'wrongPassword'
    }
    let error, pool

    await almariadb
      .createPool(config)
      .then((p) => {
        pool = p
      })
      .catch((e) => {
        error = e
      })
      .finally(() => {
        expect(pool.constructor.name).toBe('PoolPromise')
        expect(error).toBe(undefined)
      })
  })

  test(`createPool() returns pool(wrong configuration) - Await`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'wrongPassword'
    }
    let error, pool

    try {
      pool = await almariadb.createPool(config)
    } catch (err) {
      error = err
    } finally {
      expect(pool.constructor.name).toBe('PoolPromise')
      expect(error).toBe(undefined)
    }
  })

  test(`createPool() returns pool - Promise`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'test'
    }
    let error, pool

    await almariadb
      .createPool(config)
      .then((p) => {
        pool = p
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(pool.constructor.name).toBe('PoolPromise')
        expect(error).toBe(undefined)
      })
  })

  test(`createPool() returns pool - Await`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'test'
    }
    let error, pool

    try {
      pool = await almariadb.createPool(config)
    } catch (err) {
      error = err
    } finally {
      expect(pool.constructor.name).toBe('PoolPromise')
      expect(error).toBe(undefined)
    }
  })
})
