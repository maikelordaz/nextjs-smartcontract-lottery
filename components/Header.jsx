/*
 * Esta es la forma facil de hacer lo mismo que en ManualHeader.jsx usando el paquete
 * web3uikit
 */
import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div>
            Decentralized Lottery
            <ConnectButton moralisAuth={false} />
        </div>
    )
}
