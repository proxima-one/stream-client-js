interface ComplexValue extends Readonly<Record<string, Value>> {}
interface ArrayValue extends ReadonlyArray<Value> {}
type Value = ArrayValue | ComplexValue | string | number | boolean | undefined | null;

export type JsonObject = ComplexValue;
