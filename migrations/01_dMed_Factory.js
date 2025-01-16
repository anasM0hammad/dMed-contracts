const contract = artifacts.require('FactoryDMed');

module.exports = async (deployer) => {
    await deployer.deploy(contract);
    const instance = await contract.deployed();
    console.log(instance);
}