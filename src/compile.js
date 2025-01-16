const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, 'contracts', 'DMed.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
	language : 'Solidity',
	sources : {
		'DMed.sol' : {
			content : source,
		},
	},
	settings : {
		outputSelection : {
			'*' : {
				'*' : ['*'],
			},
		},
	},
};

function findImports(path) {
    if (path === '@openzeppelin')
      return {
        contents:
          'library L { function f() internal returns (uint) { return 7; } }'
      };
    else return { error: 'File not found' };
}

const output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(output);
const compiledContract = output.contracts['DMed.sol'];

fs.ensureDirSync(buildPath);

for(let contract in compiledContract){
	fs.outputJsonSync(
		path.resolve(__dirname, 'build' , contract + '.json') ,
		compiledContract[contract]
	);
}