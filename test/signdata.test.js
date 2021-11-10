const { BigNumber } = require("@ethersproject/bignumber");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getBigNumber, getHexStrFromStr, getPaddedHexStrFromBN } = require("../scripts/shared/utilities");


// We are doing test MSO on rinkeby
describe("SignData", function () {
  before(async function() {
    this.SignData = await ethers.getContractFactory("SignData");
    this.signers = await ethers.getSigners();

    this.devWallet = this.signers[0];
  })

  beforeEach(async function () {
    this.signData = await this.SignData.deploy();
  })

  it("Should not allow others to request claim except owner", async function() {
    let hexData = '';
    const productName = 'hello';
    const priceUSD = getBigNumber(1);
    const productPeriod = 5;
    const conciergePrice = getBigNumber(2);

    const hexStr = getHexStrFromStr(productName);

    const paddedPriceUSDHexStr = getPaddedHexStrFromBN(priceUSD);
    const paddedPeriodHexStr = getPaddedHexStrFromBN(productPeriod);
    const paddedConciergePriceHexStr = getPaddedHexStrFromBN(conciergePrice);

    hexData = hexStr + paddedPriceUSDHexStr.slice(2) + paddedPeriodHexStr.slice(2) + paddedConciergePriceHexStr.slice(2);    
    console.log(`hexData ${hexData}`);

    const flatSig = await this.devWallet.signMessage(ethers.utils.arrayify(ethers.utils.keccak256(hexData)));
    const splitSig  = ethers.utils.splitSignature(flatSig);
    // console.log(JSON.stringify(flatSig));
    // console.log(splitSig.r);

    const senderAddress = await this.signData.getSender(
      "hello",
      getBigNumber(1),
      5,
      getBigNumber(2),
      splitSig.r,
      splitSig.s,
      splitSig.v
    );

    expect(senderAddress).to.be.equal(this.signers[0].address);
    console.log(`senderAddress ${senderAddress}`);
    console.log(this.devWallet.address);
  })
});

