import { decodeBase64, encodeBase64 } from "../../lib/base64";

export function toGlobalId(typename: string, id?: string) {
  return encodeBase64([typename, id].join(":"));
}

export function fromGlobalId(globalId: string) {
  const [typename, id] = decodeBase64(globalId).split(":");

  return {
    typename,
    id,
  };
}
