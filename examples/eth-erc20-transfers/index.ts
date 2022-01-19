// (1) Install Dependences 
import {ProximaService, StreamClient} from "../../src"
import _ from "lodash"
import BSON from "bson"

//  Event Handler Function 

function defaultHandler(data: any) {
    _.forEach(data.array, (resp: any) => {
        console.log("id", resp[0][0].toString())
        console.log(JSON.parse(Buffer.from(resp[0][3]).toString()))
    })
}




function accountTxs(data: any) {
    _.forEach(data.array, (resp: any) => {
        let txData = JSON.parse(Buffer.from(resp[0][3]).toString())
        let txId = resp[0][0].toString()
        if (txData.univ3PoolLog.data.type == "Swap" && (txData.univ3PoolLog.data.recipient == account || txData.univ3PoolLog.data.sender == account)) {
            console.log("account data", txData)
            accountTxDict[txId] =  txData
        }

    })
}

function poolTxs(data: any) {
    _.forEach(data.array, (resp: any) => {
        let txData = JSON.parse(Buffer.from(resp[0][3]).toString())
        let txId = resp[0][0].toString()
        if (txData.univ3PoolLog.pool.address == poolAddress) {
            console.log("account data", txData)
            poolTxDict[txId] =  txData
        }
    })
}

const account = '0x6c6bc977e13df9b0de53b251522280bb72383700'
var accountTxDict: { [name: string]: any } = {}

const poolAddress = '0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8'
var poolTxDict: { [name: string]: any } = {}

function main() {

    // (2) Connect to stream 
    const streamAddress = "streamdb.cluster.prod.proxima.one:443"
    const streamClient = new StreamClient(streamAddress)


    // (3) Decide which stream to connect to: 
    /*
    Example Streams: 
    - multiple.fi 
    - erc20-transfers
    - uniswapv3
    - uniswap
    */
    const streamId = "multiplefi"
    const latest = ""

    // (6) Consume Messages from block [7,501,000] and print them 
        let messageStream =streamClient.streamMessages(streamId, latest)
        messageStream.on('data', defaultHandler)
        messageStream.on('data', accountTxs)
        messageStream.on('data', poolTxs)

}

main()
