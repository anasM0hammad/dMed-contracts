import web3 from './web3'
const CampaignFactory = require('./build/CampaignFactory.json') ;
require('dotenv').config();

const factory = new web3.eth.Contract(CampaignFactory.abi , process.env.FACTORY) ;

export default factory ;