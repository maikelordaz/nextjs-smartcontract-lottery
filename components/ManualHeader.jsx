/*
 * Los archivos ***.jsx es lo mismo que ***.js pero como elemento de React, asi puedo modularizar
 * mi proyecto, y reciclar codigo a usar en varias paginas.
 * Para usarlo debo exportarlo aqui, e importarlo donde lo voy a usar
 * Este script es para la forma dificil
 * En estos archivos ***.jsx puedo meter JavaScript donde quiera usando {aqui dentro el codigo}
 */
import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function ManualHeader() {
    /*
     * const {enableWeb3} = useMoralis() este es un hook de react y me sirve para revisar el
     * estado de toda mi app. Para poder usar Moralis. Para poder usar Moralis toda la app
     * debe estar envuelta en un moralis provider que lo debo importar en _app.js
     * Solo con la linea:
     * <button onClick={async () => {await enableWeb3()}}>Connect</button>
     * sustituyo todo el try/catch del raw html para conectarme a Metamask
     */
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()

    /*
     * Este es un hook de react, que me permite verificar cosas cada vez que refresco el front
     * en este caso verifica si estoy conectado a metamask
     */

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to: ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undefinde") {
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}
