import * as _ from "lodash";

export class Parsing {
  public static parseProperty(obj: unknown, prop: string): unknown {
    if (Parsing.checkKeyExists(obj, prop))
      return obj[prop];

    if (Parsing.checkKeyExists(obj, _.upperFirst(prop)))
      return obj[_.upperFirst(prop)];

    throw new DTOParsingError(`Object is missing property: ${prop}, object: ${obj}`);

  }

  public static parsePropertyOrNull(obj: unknown, prop: string): unknown | undefined {
    if (!Parsing.checkKeyExists(obj, prop))
      return undefined;

    return Parsing.parseProperty(obj, prop);
  }

  public static parseArrayProperty(obj: unknown, prop: string): unknown[] {
    const result = Parsing.parseProperty(obj, prop);
    return Parsing.parseArray(result);
  }

  public static parseArrayPropertyOrEmpty(obj: unknown, prop: string): unknown[] {
    if (!Parsing.checkKeyExists(obj, prop))
      return [];
    const result = Parsing.parseProperty(obj, prop);
    return Parsing.parseArray(result);
  }

  public static parseArray(result: unknown): unknown[] {
    if (!Array.isArray(result))
      throw new DTOParsingError(`Object has wrong type, expected: array, got: ${typeof result}, object: ${result}`);

    return result;
  }

  public static parseNumberProperty(obj: unknown, prop: string): number {
    const result = Parsing.parseProperty(obj, prop);
    if (typeof result === "number")
      return result;

    if (typeof result === "string")
      return parseFloat(result);

    throw new DTOParsingError(`Object has property ${prop} of wrong type, expected: number, got: ${typeof result}, object: ${obj}`);
  }

  public static parseNumberOrNullProperty(obj: unknown, prop: string): number | undefined {
    if (!Parsing.checkKeyExists(obj, prop))
      return undefined;

    const result = Parsing.parseProperty(obj, prop);

    if (!result)
      return undefined;

    if (typeof result !== "number") {
      throw new DTOParsingError(`Object has property ${prop} of wrong type, expected: number, got: ${typeof result}, object: ${obj}`);
    }
    return result;
  }

  public static parseHashMapProperty<T>(obj: unknown, prop: string, parser: (item: unknown) => T): Record<string, T> {
    const hashMap = Parsing.parseProperty(obj, prop);
    return Parsing.parseHashMap(hashMap, parser);
  }

  public static parseHashMap<T>(hashMap: unknown, parser: (item: unknown) => T): Record<string, T> {
    const ret: Record<string, T> = {};

    if (typeof hashMap === "object" && hashMap !== null)
      Object.entries(hashMap).forEach(([key, value]) => ret[key] = parser(value));

    return ret;
  }

  public static parseHashMapPropertyProfiles<T>(obj: unknown, prop: string, parser: (item: unknown) => T): Record<string, T> {
    const ret: Record<string, T> = {};
    const hashMap = Parsing.parseProperty(obj, prop);

    if (typeof hashMap === "object" && hashMap !== null)
      Object.entries(hashMap).forEach(([key, value]) => ret[_.lowerFirst(key)] = parser(value));

    return ret;
  }

  public static parseMapProperty<U, T>(obj: unknown, prop: string, keyParser: (item: unknown) => U, parser: (item: unknown) => T): Map<U, T> {
    const ret: Map<U, T> = new Map<U, T>();
    const hashMap = Parsing.parseProperty(obj, prop);

    if (typeof hashMap === "object" && hashMap !== null)
      Object.entries(hashMap).forEach(([key, value]) => ret.set(keyParser(key), parser(value)));

    return ret;
  }

  public static parseStringProperty(obj: unknown, prop: string): string {
    let result = Parsing.parseProperty(obj, prop);
    if (typeof result === "boolean")
      result = result.toString();

    if (typeof result === "number")
      result = result.toString();

    if (typeof result !== "string")
      throw new DTOParsingError(`Object has property ${prop} of wrong type, expected: string, got: ${typeof result}, object: ${obj}`);

    return result;
  }

  public static parseStringOrNullProperty(obj: unknown, prop: string): string | undefined {
    if (!Parsing.checkKeyExists(obj, prop))
      return undefined;

    return Parsing.parseStringProperty(obj, prop);
  }

  public static parseString(obj: unknown): string {
    if (typeof obj !== "string")
      throw new DTOParsingError(`Object is of wrong type, expected: string, got: ${typeof obj}`);

    return obj;
  }

  public static parseBoolProperty(obj: unknown, prop: string): boolean {
    const result = Parsing.parseProperty(obj, prop);
    if (typeof result !== "boolean")
      throw new DTOParsingError(`Object has property ${prop} of wrong type, expected: bool, got: ${typeof result}, object: ${obj}`);

    return result;
  }

  public static parseBoolOrNullProperty(obj: unknown, prop: string): boolean | undefined {
    if (!Parsing.checkKeyExists(obj, prop))
      return undefined;

    const result = Parsing.parseProperty(obj, prop);
    if (typeof result !== "boolean")
      throw new DTOParsingError(`Object has property ${prop} of wrong type, expected: bool, got: ${typeof result}, object: ${obj}`);

    return result;
  }

  public static checkKeyExists<Y extends PropertyKey>(obj: unknown, prop: Y): obj is Record<Y, unknown> {
    if (typeof obj !== "object" || !obj)
      return false;

    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
}

class DTOParsingError extends Error {
  public constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, DTOParsingError.prototype);
    this.name = DTOParsingError.name;
  }
}
