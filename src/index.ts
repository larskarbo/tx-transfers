import { message } from './constants.js'
import {
	Contract,
	JsonRpcProvider,
	keccak256,
	toUtf8Bytes
} from "essential-eth";
const provider = new JsonRpcProvider("https://cloudflare-eth.com");

export const getTxTransfers = () => {
	console.log(message)
}

