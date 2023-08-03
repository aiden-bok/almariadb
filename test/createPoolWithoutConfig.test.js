import almariadb from '../src/index.js'

describe('MariaDB pool create tests', () => {
  test(`createPool() throws error(miss configuration)`, () => {
    let error, pool

    try {
      pool = almariadb.createPool()
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
})
