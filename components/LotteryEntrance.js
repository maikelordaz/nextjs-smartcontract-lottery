import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"

export default function LotteryEntrance() {
    const { runContractFunction: enterRaffle } = useWeb3Contract({
        /*
         * Estos valores podria darlos como constantes, pero es mejor automatizarlo con un script en
         * el directorio del contrato
         */
        /*
    abi: //,
    contractAddress: //,
    functionName: //,
    params: {},
    msgValue:
    */
    })

    return <div>Hi from Lottery LotteryEntrance</div>
}
