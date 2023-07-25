import almariadb from '../src/index.js'

describe('MariaDB pool create tests', () => {
  test(`createPool() throw error`, () => {
    let error

    try {
      const config = {
        host: '127.0.0.1',
        port: 3308,
        database: '',
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
      database: 'mysql',
      user: 'root',
      password: 'testdb',
      logger: { error: null, network: null, query: null }
    }

    const pool = almariadb.createPool(config)
    pool.on('connection', (connection) => {
      console.log(`Connected database: ${connection.info.database}`)
      expect(connection.info.database).toBe('mysql')
    })

    await pool
      .getConnection()
      .then((connection) => {
        console.log(connection.query)
        connection.release()
        console.log(connection.escapeId)
      })
      .catch((error) => {
        console.error(error)
      })
  })
})
