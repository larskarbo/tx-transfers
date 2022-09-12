import { keccak256, toUtf8Bytes } from "essential-eth";

export const message = 'Hello World'

const transferSig = keccak256(toUtf8Bytes("Transfer(address,address,uint256)"));
