import { strict as assert } from "assert";
import { splitBySemicolon } from "./string";

export function parseConnectionString(str: string): Record<string, string> {
  assert(str);

  const parts = splitBySemicolon(str);
  const properties = parts
    .map(x => x.trim())
    .map(x => x.split("=").map(y => y.trim()));

  const invalidProperties = properties.filter(pairs => pairs.length != 2);
  if (invalidProperties.length)
    throw new Error(`Invalid ConnectionString ${str}. Sample: "Key1=Value1;Key2=Value2"`);

  const options: Record<string, string> = {};

  for (let [key, val] of properties)
    options[key.toLowerCase()] = val;

  return options;
}
