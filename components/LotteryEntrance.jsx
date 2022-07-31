import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    // Aquí digo "saca de useMoralis el objeto chainId y renombralo chainIdHex"
    const { isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    /*
     * Aquí digo "crea una nueva variable que se llame chainId". Se va a actualizar sola por el
     * boton que puse en Header.jsx
     */
    const chainId = parseInt(chainIdHex)
    // La direccion del contrato la voy a buscar en el array que se genera en el archivo .JSON
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    /*
     * Los hook useState en este caso seria:
     * entranceFee: variable que estoy actualizando
     * setEntranceFee: funcion que me actualiza la variable
     * "0": valor de entrada para la variable, en este caso entranceFee
     * puedo leer mas en:
     * https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables
     */
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        /*
         * Estos valores podria darlos como constantes, pero es mejor automatizarlo con un script en
         * el directorio del contrato
         */
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        /*
         * Otra forma seria hacer un llamado al contrato
         * const options = { abi, contractAddress: raffleAddress }
         * const fee = await Moralis.executeFunction({
         *       functionName: "getEntranceFee",
         *       ...options,
         * })
         */

        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        setEntranceFee(entranceFeeFromCall)
        setNumberOfPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        updateUI()
        handleNewNotification(tx)
    }

    /*
     * Sobre todo esto que me deja hacer web3uikit puedo ver mas en:
     * https://web3ui.github.io/web3uikit/?path=/story/5-popup-notification--hook-demo
     * aqui hay ejemplos graficos de como se ven las cosas, también hay codigo que puedo
     * tomar para mi proyecto
     */
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            <h1 className="py-4 px-4 font-bold text-3xl">Smart Lottery</h1>
            {raffleAddress ? (
                <div className="">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>Number of players: {numberOfPlayers}</div>
                    <div>Recent winner: {recentWinner}</div>
                </div>
            ) : (
                <div>No Raffle address detected!</div>
            )}
        </div>
    )
}
