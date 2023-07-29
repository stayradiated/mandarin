const updateValue = (newValue) => newValue

export default class AsyncValue {
  constructor(options) {
    Object.assign(
      this,
      {
        value: 'value',
        error: 'error',
        promise: 'promise',
        fetched: 'fetched',

        updateValue,
      },
      options,
    )
  }

  handleRequest(state, promise) {
    return {
      ...state,
      [this.promise]: promise,
      [this.fetched]: false,
    }
  }

  handleFailure(state, error) {
    return {
      ...state,
      [this.promise]: undefined,
      [this.error]: error,
    }
  }

  handleSuccess(state, value) {
    return {
      ...state,
      [this.promise]: undefined,
      [this.error]: undefined,
      [this.fetched]: true,
      [this.value]: this.updateValue(value, state[this.value]),
    }
  }
}
