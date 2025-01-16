const HDWalletProvider = require('@truffle/hdwallet-provider') ;
const Web3 = require('web3') ;
require('dotenv').config();

const factory = require('../build/contracts/FactoryDMed.json') ;

const accountMnemonics = process.env.MNEMONICS ;   // Should be passed using env variable in production 
const infuraNet = process.env.INFURA ;

const HdProvider = new HDWalletProvider(accountMnemonics, infuraNet) ;
const web3 = new Web3(HdProvider) ;

const deploy = async () => {
	const accounts = await web3.eth.getAccounts() ;
	console.log("Attempting to deploy account from : " + accounts[0]) ;

	const result = await new web3.eth.Contract(factory.abi).deploy({
		data : factory.evm.bytecode.object
	}).send({
		from : accounts[0],
		gas : '2000000'
	});

	console.log(result.options.address) ;
	HdProvider.engine.stop() ;
}

deploy() ;