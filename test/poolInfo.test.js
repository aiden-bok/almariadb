import { jest } from '@jest/globals'

import almariadb from '../src/index.js'

afterAll(() => {
  jest.restoreAllMocks()
})

describe('MariaDB pool info output tests', () => {
  test(`poolInfo() throws error`, async () => {
    let error
    try {
      almariadb.poolInfo()
    } catch (err) {
      error = err
    } finally {
      expect(error.message).toBe(
        `[poolInfo] 'MariaDB' connection pool not created!`
      )
    }
  })

  test(`poolInfo() pool info output`, async () => {
    const logSpy = jest.spyOn(global.console, 'log')
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'test',
      logger: { error: null, network: null, query: null }
    }
    almariadb.createPool(config)
    almariadb.poolInfo()

    expect(logSpy).toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledTimes(2)
    expect(logSpy).toHaveBeenCalledWith(
      '[poolInfo] MariaDB connections - active: 0 / idle: 0 / total: 0'
    )
  })
})
