import { db } from './db'
import { sequence } from '0xsequence'

const signUp = async (number: string, email: string) => {
    return await db.append({number: number, email: email})
}

const auth = async (wallet: string, ethAuthProofString: string) => {

    const chainId = 'polygon'
    const api = new sequence.api.SequenceAPIClient('https://api.sequence.app')
    
    const { isValid } = await api.isValidETHAuthProof({
        chainId: chainId, walletAddress: wallet, ethAuthProofString: ethAuthProofString
    })

    console.log(isValid)
    if(!isValid) throw new Error('invalid wallet auth')
    return isValid
}

export {
    signUp,
    auth
}