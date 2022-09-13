import { keccak256, toUtf8Bytes } from "essential-eth";

export const message = 'Hello World'

export const transferSig = keccak256(toUtf8Bytes("Transfer(address,address,uint256)"));
export const transferSingleSig = keccak256(toUtf8Bytes("TransferSingle(address,address,address,uint256,uint256)"));
