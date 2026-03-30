import { bech32 } from "bech32";
import blake2b from "blake2b";
import { Buffer } from "buffer";

/**
 * Derive a Cardano enterprise address from a raw Ed25519 public key.
 * Enterprise address = type 6 header byte + Blake2b-224(pubkey)
 */
export function deriveEnterpriseAddress(publicKeyHex, networkId = 1) {
  const pubKeyBytes = Buffer.from(publicKeyHex, "hex");
  const keyHash = Buffer.from(blake2b(28).update(pubKeyBytes).digest());
  const headerByte = (6 << 4) | (networkId & 0x0f);
  const addressBytes = Buffer.concat([Buffer.from([headerByte]), keyHash]);
  const words = bech32.toWords(addressBytes);
  const hrp = networkId === 0 ? "addr_test" : "addr";
  return bech32.encode(hrp, words, 200);
}

/**
 * Bech32-encode raw Cardano address bytes with the correct HRP
 * based on the address type and network from the header byte.
 */
export function bech32EncodeAddress(addressBytes) {
  const buf = Buffer.isBuffer(addressBytes)
    ? addressBytes
    : Buffer.from(addressBytes);
  const headerByte = buf[0];
  const addressType = (headerByte >> 4) & 0x0f;
  const networkId = headerByte & 0x0f;

  let hrp;
  if (addressType >= 14) {
    // Reward / stake address
    hrp = networkId === 0 ? "stake_test" : "stake";
  } else {
    // Base, enterprise, pointer, bootstrap
    hrp = networkId === 0 ? "addr_test" : "addr";
  }

  const words = bech32.toWords(buf);
  return bech32.encode(hrp, words, 200);
}
