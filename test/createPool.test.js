import almariadb from '../src/index.js'

describe('MariaDB pool create tests', () => {
  test(`createPool() throws error`, () => {
    let error
    try {
      const config = {
        host: '127.0.0.1',
        port: 3308,
        database: 'test',
        user: 'test',
        password: ''
      }
      almariadb.createPool(config)
    } catch (err) {
      error = err
    } finally {
      expect(error.message).toBe(
        `[createPool] Information needed to connect to 'MariaDB' is missing in the configuration information.`
      )
      expect(error).toBeInstanceOf(Error)
    }
  })

  test(`createPool() returns pool`, async () => {
    const config = {
      host: '127.0.0.1',
      port: 3308,
      database: 'test',
      user: 'test',
      password: 'test',
      logger: { error: null, network: null, query: null }
    }
    const pool = almariadb.createPool(config)
    pool.on('connection', (connection) => {
      // console.log(`Connected database: ${connection.info.database}`)
      expect(connection.info.database).toBe('test')
    })

    let connection, error
    await pool
      .getConnection()
      .then((conn) => {
        // console.log(`Connected database: ${conn.info.database}`)
        connection = conn
      })
      .catch((err) => {
        // console.error(err)
        error = err
      })
      .finally(() => {
        expect(connection.info.database).toBe('test')
        expect(error).toBe(undefined)
      })
  })
})
