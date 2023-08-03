import almariadb from '../src/index.js'

describe('MariaDB call procedure or function tests using connection pool', () => {
  const config = {
    host: '127.0.0.1',
    port: 3308,
    database: 'test',
    user: 'test',
    password: 'test',
    logger: { error: null, network: null, query: null }
  }
  almariadb.createPool(config)

  const target = 'simple_proc'
  const parameters = [20]

  test(`call() throws error - Promise`, async () => {
    let error, result

    await almariadb
      .call()
      .then((res) => {
        result = res
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(result).toBe(undefined)
        expect(error.message).toBe(
          `[parseCall] Not passed call target to be used in query statement.`
        )
        expect(error).toBeInstanceOf(Error)
      })
  })

  test(`call('simple_proc') throws error(parameter) - Promise`, async () => {
    let error, result

    await almariadb
      .call(target)
      .then((res) => {
        result = res
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(result).toBe(undefined)
        expect(
          error.message.includes('Incorrect number of arguments for PROCEDURE')
        ).toBe(true)
        expect(error).toBeInstanceOf(Error)
      })
  })

  test(`call('simple_proc') returns result - Promise`, async () => {
    let error, result

    await almariadb
      .call(target, parameters)
      .then((res) => {
        result = res
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(result[0]).toStrictEqual([{ 'param1 * param1': 400n }])
        expect(error).toBe(undefined)
      })
  })
})
