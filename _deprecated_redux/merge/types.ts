export type GetIdFn<Key, Value> = (value: Value) => Key
export type UpdateFn<Value> = (
  newValue: Value,
  oldValue: Value | undefined,
) => Value
