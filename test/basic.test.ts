import { JsonRpcProvider } from "essential-eth";
import { expect, test } from "vitest";
import { getTxTransfers } from "../src/index.js";
import { getDecimals } from "../src/utils/get-decimals.js";

const MAINNET_CHAINID = 1;

const erc20Hash =
  "0x335d004f816a7d20fe7e66c05fddd563311d284c027fb925cbe72208779580a3";
const erc721Hash =
  "0x59787bd305f0f775ea2dedb9768f6914a121e9090a40cb29fccd01aef90e128f";
const erc1155Hash =
  "0xb87d2e1f7a70f961667ad4214791667afe85f24ae99411aaf025f6ed249931ba";

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const erc721 = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";

const provider = new JsonRpcProvider("https://cloudflare-eth.com");
test("erc20", async () => {
  const yo = await getTxTransfers(erc20Hash, provider);
  expect(yo[0]?.type).toBe("erc20");
});

test("erc721", async () => {
  const yo = await getTxTransfers(erc721Hash, provider);
  expect(yo[0]?.type).toBe("erc721");
});

test("erc1155", async () => {
  const yo = await getTxTransfers(erc1155Hash, provider);
  expect(yo[0]?.type).toBe("erc1155");
});

test("get-decimals", async () => {
  const decimals = await getDecimals(
    {
      address: USDC,
      chainId: MAINNET_CHAINID,
    },
    provider
  );

  expect(decimals).toBe(6);
  console.log("decimals:", decimals);
});

test("get-decimals fails for nft", async () => {
  const decimals = getDecimals(
    {
      address: erc721,
      chainId: MAINNET_CHAINID,
    },
    provider
  );

  expect(decimals).rejects.toThrow(/execution reverted/);
});
