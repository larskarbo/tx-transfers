import { Contract, JsonRpcProvider } from "essential-eth";
import mem from "mem";

const getDecimalsRaw = async (
  {
    address,
    chainId,
  }: {
    address: string;
    chainId: number;
  },

  provider: JsonRpcProvider
) => {
  const contract = new Contract(
    address,
    [
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [
          {
            name: "",
            type: "uint8",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    provider
  );
  return await contract.decimals();
};

export const getDecimals = mem(getDecimalsRaw);
