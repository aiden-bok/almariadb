import almariadb from '../src/index.js'

describe('MariaDB select query tests using connection pool', () => {
  const config = {
    host: '127.0.0.1',
    port: 3308,
    database: 'test',
    user: 'test',
    password: 'test',
    logger: { error: null, network: null, query: null }
  }
  almariadb.createPool(config)

  test(`select() throws error - Promise`, async () => {
    let error, result

    await almariadb
      .select()
      .then((res) => {
        result = res
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(result).toBe(undefined)
        expect(error.message).toBe(
          `[parseTable] Not passed table name to be used in query statement.`
        )
        expect(error).toBeInstanceOf(Error)
      })
  })

  test(`select() throws error - Await`, async () => {
    let error, result

    try {
      result = await almariadb.select()
    } catch (err) {
      error = err
    } finally {
      expect(result).toBe(undefined)
      expect(error.message).toBe(
        `[parseTable] Not passed table name to be used in query statement.`
      )
      expect(error).toBeInstanceOf(Error)
    }
  })

  test(`select() returns result - Promise`, async () => {
    let error, result

    const table = 'plays'
    const columns = ['name', 'plays']
    const where = { name: `"John"` }

    await almariadb
      .select(table, columns, where)
      .then((res) => {
        result = res
      })
      .catch((err) => {
        error = err
      })
      .finally(() => {
        expect(result).toStrictEqual([{ name: 'John', plays: 20 }])
        expect(error).toBe(undefined)
      })
  })

  test(`select() returns result - Await`, async () => {
    let error, result

    const table = 'plays'
    const columns = ['name', 'plays']
    const where = { name: `"John"` }

    try {
      result = await almariadb.select(table, columns, where)
    } catch (err) {
      error = err
    } finally {
      expect(result).toStrictEqual([{ name: 'John', plays: 20 }])
      expect(error).toBe(undefined)
    }
  })

  test(`selectGroup() returns result - Await`, async () => {
    let error, result

    const table = 'plays'
    const columns = '(wins / plays) AS winavg'
    const where = { name: `"John"` }
    const group = 'winavg'

    try {
      result = await almariadb.selectGroup(table, columns, where, group)
    } catch (err) {
      error = err
    } finally {
      expect(result).toStrictEqual([{ winavg: '0.3000' }])
      expect(error).toBe(undefined)
    }
  })

  test(`selectGroup() returns result(having) - Await`, async () => {
    let error, result

    const table = 'plays'
    const columns = '(wins / plays) AS winavg, AVG(plays)'
    const where = null
    const group = 'winavg'
    const having = 'AVG(plays) > 20'

    try {
      result = await almariadb.selectGroup(table, columns, where, group, having)
    } catch (err) {
      error = err
    } finally {
      expect(result).toStrictEqual([
        {
          'AVG(plays)': '32.0000',
          winavg: '0.2500'
        },
        {
          'AVG(plays)': '22.0000',
          winavg: '0.3636'
        }
      ])
      expect(error).toBe(undefined)
    }
  })

  test(`selectJoin() returns result - Await`, async () => {
    let error, result

    const table = 'a AS A'
    const type = 'INNER'
    const join = 'b AS B'
    const on = 'A.a_no = B.a_no'
    const columns = ['A.a_country', 'B.b_city']

    try {
      result = await almariadb.selectJoin(table, type, join, on, columns)
    } catch (err) {
      error = err
    } finally {
      expect(result).toStrictEqual([
        {
          a_country: 'A',
          b_city: 'AA'
        },
        {
          a_country: 'B',
          b_city: 'BB'
        }
      ])
      expect(error).toBe(undefined)
    }
  })

  test(`selectJoinGroup() returns result - Await`, async () => {
    let error, result

    const table = 'a AS A'
    const type = 'LEFT'
    const join = 'b AS B'
    const on = 'A.a_no = B.a_no'
    const columns = ['A.a_country', 'B.b_city']
    const where = null
    const group = 'B.b_city'

    try {
      result = await almariadb.selectJoinGroup(
        table,
        type,
        join,
        on,
        columns,
        where,
        group
      )
    } catch (err) {
      error = err
    } finally {
      expect(result).toStrictEqual([
        { a_country: 'C', b_city: null },
        { a_country: 'A', b_city: 'AA' },
        { a_country: 'B', b_city: 'BB' }
      ])
      expect(error).toBe(undefined)
    }
  })
})
