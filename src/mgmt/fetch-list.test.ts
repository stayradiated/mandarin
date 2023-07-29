import { describe, test, expect } from 'vitest'
import { getInitialState, fetchList } from './fetch-list.js'

const fetchNumberList = async (range: [number, number]) => {
  console.log('FETCHING', range)

  const valueList = Array.from(
    { length: range[1] - range[0] },
    (_, i) => i + range[0],
  )
  return {
    valueList,
    total: 100,
  }
}

const createStore = <Value>() => {
  const store = {
    state: getInitialState<Value>(),
  }

  return {
    getState() {
      return store.state
    },
    setState(nextState: typeof store.state) {
      store.state = nextState
    },
  }
}

describe('fetchList', () => {
  test('does it work?', async () => {
    const store = createStore<number>()

    await Promise.all([
      fetchList<number>({
        range: [0, 10],
        fetch: fetchNumberList,
        getState: store.getState,
        setState: store.setState,
      }),
      fetchList<number>({
        range: [5, 15],
        fetch: fetchNumberList,
        getState: store.getState,
        setState: store.setState,
      }),
      fetchList<number>({
        range: [20, 30],
        fetch: fetchNumberList,
        getState: store.getState,
        setState: store.setState,
      }),
      fetchList<number>({
        range: [40, 50],
        fetch: fetchNumberList,
        getState: store.getState,
        setState: store.setState,
      }),
    ])

    await fetchList<number>({
      range: [10, 20],
      fetch: fetchNumberList,
      getState: store.getState,
      setState: store.setState,
    })

    expect(store.getState()).toStrictEqual({
      promiseMap: new Map(),
      errorMap: new Map(),
      fetchedSet: new Set([
        [0, 30],
        [40, 50],
      ]),
      valueList: [
        ...Array.from({ length: 30 }, (_, i) => i),
        ...Array.from({ length: 10 }, () => undefined),
        ...Array.from({ length: 10 }, (_, i) => i + 40),
        ...Array.from({ length: 50 }, () => undefined),
      ],
      total: 100,
    })
  })
})
