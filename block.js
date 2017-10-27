'use strict';
var CryptoJS = require("crypto-js");

class Block {
    constructor(index, previousHash, timestamp, data, hash) {
        this.index = index;
        this.previousHash = previousHash.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.hash = hash.toString();
    }
}

var getGenesisBlock = () => {
    return new Block(0, "0", 1465154705, "my genesis block!!", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7");
};

var blockchain = [getGenesisBlock()];

module.exports = {

getBlockchain: function () {
    return blockchain;
}, 

getLatestBlock: function() {
    var blockchain  = this.getBlockchain();
    return blockchain[blockchain.length - 1];
},

generateNextBlock : function (blockData) {
    var previousBlock = this.getLatestBlock();
    var nextIndex = previousBlock.index + 1;
    var nextTimestamp = new Date().getTime() / 1000;
    var nextHash = this.calculateHash(nextIndex, previousBlock.hash, nextTimestamp, blockData);
    return new Block(nextIndex, previousBlock.hash, nextTimestamp, blockData, nextHash);
},

calculateHashForBlock : function (block) {
    return this.calculateHash(block.index, block.previousHash, block.timestamp, block.data);
},

calculateHash : function (index, previousHash, timestamp, data) {
    return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
},

addBlock : function (newBlock) {
    if (this.isValidNewBlock(newBlock, this.getLatestBlock())) {
        this.getBlockchain().push(newBlock);
    }
},

isValidNewBlock : function (newBlock, previousBlock)  {
    if (previousBlock.index + 1 !== newBlock.index) {
        console.log('invalid index');
        return false;
    } else if (previousBlock.hash !== newBlock.previousHash) {
        console.log('invalid previoushash');
        return false;
    } else if (this.calculateHashForBlock(newBlock) !== newBlock.hash) {
        console.log(typeof (newBlock.hash) + ' ' + typeof this.calculateHashForBlock(newBlock));
        console.log('invalid hash: ' + this.calculateHashForBlock(newBlock) + ' ' + newBlock.hash);
        return false;
    }
    return true;
},

replaceChain : function (newBlocks)  {
    if (this.isValidChain(newBlocks) && newBlocks.length > blockchain.length) {
        console.log('Received blockchain is valid. Replacing current blockchain with received blockchain');
        this.getBlockchain() = newBlocks;
        //this.broadcast(responseLatestMsg());
    } else {
        console.log('Received blockchain invalid');
    }
},

isValidChain : function (blockchainToValidate)  {
    if (JSON.stringify(blockchainToValidate[0]) !== JSON.stringify(this.getGenesisBlock())) {
        return false;
    }
    var tempBlocks = [blockchainToValidate[0]];
    for (var i = 1; i < blockchainToValidate.length; i++) {
        if (this.isValidNewBlock(blockchainToValidate[i], tempBlocks[i - 1])) {
            tempBlocks.push(blockchainToValidate[i]);
        } else {
            return false;
        }
    }
    return true;
},

};