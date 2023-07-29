import { produce, enableMapSet as immerEnableMapSet, castDraft } from 'immer'
import { createPirateMap } from 'piratemap'
import {
  filterListByRangeIntersect,
  subtractListFromRange,
  subtractRangeList,
  clean,
  type Range,
} from '../lib/index.js'

immerEnableMapSet()

const isRangeEqual = (a: Range, b: Range) => {
  return a[0] === b[0] && a[1] === b[1]
}

const pRangeMap = createPirateMap<Range>(isRangeEqual)

type State<Value> = {
  readonly valueList: Array<Value | undefined>
  readonly promiseMap: Map<Range, Promise<State<Value>>>
  readonly errorMap: Map<Range, Error>
  readonly fetchedSet: Set<Range>
  readonly total: number
}

type HandleRequestOptions<Value> = {
  state: State<Value>
  range: Range
  promise: Promise<State<Value>>
}

const handleRequest = <Value>(
  options: HandleRequestOptions<Value>,
): State<Value> => {
  const { state, range, promise } = options
  return produce(state, (draft) => {
    pRangeMap.set(draft.promiseMap, range, promise)
  })
}

type HandleFailureOptions<Value> = {
  state: State<Value>
  range: Range
  error: Error
}

const handleFailure = <Value>(
  options: HandleFailureOptions<Value>,
): State<Value> => {
  const { state, range, error } = options
  return produce(state, (draft) => {
    pRangeMap.delete(draft.promiseMap, range)
    pRangeMap.set(draft.errorMap, range, error)
  })
}

type HandleSuccessOptions<Value> = {
  state: State<Value>
  range: Range
  valueList: Value[]
  total: number
}

const handleSuccess = <Value>(
  options: HandleSuccessOptions<Value>,
): State<Value> => {
  const { state, range, valueList, total } = options
  return produce(state, (draft) => {
    draft.total = total
    pRangeMap.delete(draft.promiseMap, range)
    pRangeMap.delete(draft.errorMap, range)

    draft.fetchedSet = new Set(clean([...draft.fetchedSet.keys(), range]))

    const offset = range[0]
    for (const [index, value] of valueList.entries()) {
      draft.valueList[index + offset] = castDraft(value)
    }

    const padding = Array.from<undefined>({
      length: total - draft.valueList.length,
    }).fill(undefined)
    if (padding.length > 0) {
      draft.valueList.push(...padding)
    }
  })
}

const getInitialState = <Value>(): State<Value> => {
  return {
    valueList: [],
    promiseMap: new Map(),
    errorMap: new Map(),
    fetchedSet: new Set(),
    total: 0,
  }
}

type FetchListOptions<Value> = {
  range: Range
  fetch: (range: Range) => Promise<{ valueList: Value[]; total: number }>
  getState: () => Readonly<State<Value>>
  setState: (state: Readonly<State<Value>>) => void
}

const fetchList = async <Value>(
  options: FetchListOptions<Value>,
): Promise<State<Value>> => {
  const { range, fetch, getState, setState } = options

  const initialState = getState()

  // Find all they promises that make up this range and wait for them
  const promisedRangeList = filterListByRangeIntersect(
    [...initialState.promiseMap.keys()],
    range,
  )
  const promisedValueList = promisedRangeList.map(async (key) =>
    initialState.promiseMap.get(key),
  )

  const unpromisedRangeList = subtractListFromRange(promisedRangeList, range)
  if (unpromisedRangeList.length === 0) {
    return Promise.all(promisedValueList).then(() => getState())
  }

  const fetchedRangeList = [...initialState.fetchedSet.keys()]
  const unfetchedRangeList = subtractRangeList(
    unpromisedRangeList,
    fetchedRangeList,
  )
  if (unfetchedRangeList.length === 0) {
    return initialState
  }

  const requestPromiseList: Array<Promise<State<Value>>> = []

  for (const trimmedRange of unfetchedRangeList) {
    const promise = fetch(trimmedRange).then(
      ({ valueList, total }) => {
        setState(
          handleSuccess({
            state: getState(),
            range: trimmedRange,
            valueList,
            total,
          }),
        )
        return getState()
      },
      (error: Error) => {
        setState(
          handleFailure({
            state: getState(),
            range: trimmedRange,
            error,
          }),
        )
        return getState()
      },
    )

    requestPromiseList.push(promise)
    setState(handleRequest({ state: getState(), range: trimmedRange, promise }))
  }

  // Else dispatch the action
  return Promise.all([...promisedValueList, ...requestPromiseList]).then(() =>
    getState(),
  )
}

export { fetchList, getInitialState }
