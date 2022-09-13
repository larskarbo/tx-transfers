import type { JsonRpcProvider as EthersJsonRpcProvider } from '@ethersproject/providers'
import { hexDataSlice, JsonRpcProvider, Log, TinyBig } from 'essential-eth'
import { transferSig, transferSingleSig } from './constants.js'

const parseAddress = (maybeAddress: string) => {
	return maybeAddress.replace('0x000000000000000000000000', '0x')
}

const getTransfers = (log: Log) => {
	if (log.topics[0] && log.topics[0] === transferSig) {
		// ok it is probably erc20 or erc721

		// from and to are indexed so we can find them in topics

		const fromAddress = parseAddress(log.topics[1])
		const toAddress = parseAddress(log.topics[2])

		if (log.topics[3]) {
			// probably erc721
			const tokenId = log.topics[3]
			return {
				from: fromAddress,
				to: toAddress,
				hash: log.transactionHash,
				contractAddress: log.address,
				amount: '1',
				tokenId: new TinyBig(tokenId).toFixed(),
				type: 'erc721',
			} as const
		}

		const amount = new TinyBig(log.data).toFixed()

		return {
			from: fromAddress,
			to: toAddress,
			hash: log.transactionHash,
			contractAddress: log.address,
			amount: amount,
			type: 'erc20',
		} as const
	}

	if (log.topics[0] && log.topics[0] === transferSingleSig) {
		// probably erc1155

		const fromAddress = parseAddress(log.topics[2])
		const toAddress = parseAddress(log.topics[3])
		const tokenId = new TinyBig(hexDataSlice(log.data, 0, 32)).toFixed()
		const value = new TinyBig(hexDataSlice(log.data, 32, 64)).toFixed()

		return {
			from: fromAddress,
			to: toAddress,
			hash: log.transactionHash,
			contractAddress: log.address,
			amount: value,
			tokenId: tokenId,
			type: 'erc1155',
		} as const
	}
}

type Transfer = {
	from: string
	contractAddress: string
	to: string
	amount: string
	hash: string
	type: 'erc20' | 'erc721' | 'erc1155'
}

export const getTxTransfers = async (
	txHash: string,
	provider: JsonRpcProvider | EthersJsonRpcProvider,
): Promise<Transfer[]> => {
	const receipt = await provider.getTransactionReceipt(txHash)
	const logs = receipt.logs

	const transfers = logs.map((log) => getTransfers(log))

	// eslint-disable-next-line unicorn/no-array-callback-reference
	return transfers.filter(isNotUndefinedOrNull)
}

export const isNotUndefinedOrNull = <T>(
	item: T | undefined | null,
): item is T => {
	return !!item
}
