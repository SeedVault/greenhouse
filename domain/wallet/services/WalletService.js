const { SeedTokenAPIClientEthereumETHPersonal } = require('seedtoken-api-client');
const fetch = require('node-fetch');
const Transaction = require('../validators/Transaction');
const ValidationError = require('mongoose/lib/error/validation');
const ValidatorError = require('mongoose/lib/error/validation');
// const BigNumber = require('bignumber.js');

class WalletNotFoundError extends ValidationError {
  constructor(message) {
    super(message);
    this.name = 'WalletNotFoundError';
    this.errors['_'] = { message: 'domain.wallet.validation.wallet_not_found' };
  }
}

const WalletService = {

  getDashboardInfo: async(username) => {
    let profileData = await WalletService.findProfiles([username]);
    let profile = profileData[username];
    const st = SeedTokenAPIClientEthereumETHPersonal.getInstance(process.env.PARITY_URL);
    let balance = await st.getBalance(profile.walletAddress);
    let createdAtDate = new Date(profile.createdAt);
    let createdAtUnixEpoch = createdAtDate.getTime()/1000|0;
    let latestTransactions = await st.getLastNTransactions(profile.walletAddress, 5, process.env.WALLET_BUFFER_SIZE, process.env.WALLET_TIMEOUT, createdAtUnixEpoch);
    // retrieve profiles
    let addresses = [];
    let transactions = [];
    if (latestTransactions.length > 0) {
      for (let i = 0; i < latestTransactions.length; i++) {
        if (!addresses.includes(latestTransactions[i].from.toLowerCase())) {
          addresses.push(latestTransactions[i].from.toLowerCase());
        }
        if (!addresses.includes(latestTransactions[i].to.toLowerCase())) {
          addresses.push(latestTransactions[i].to.toLowerCase());
        }
      }
      let allProfiles = await WalletService.findProfiles(addresses);
      // format transactions
      for (let i = 0; i < latestTransactions.length; i++) {
        let sDate = new Date(latestTransactions[i].timestamp * 1000);
        let fromUsername = '';
        let toUsername = '';
        let sent = (latestTransactions[i].from.toLowerCase() === profile.walletAddress.toLowerCase());
        if (allProfiles[latestTransactions[i].from.toLowerCase()] !== undefined) {
          fromUsername = allProfiles[latestTransactions[i].from.toLowerCase()].username;
        }
        if (allProfiles[latestTransactions[i].to.toLowerCase()] !== undefined) {
          toUsername = allProfiles[latestTransactions[i].to.toLowerCase()].username;
        }
        transactions.push({
          from_username:fromUsername,
          from_wallet_address: latestTransactions[i].from,
          to_username: toUsername,
          to_wallet_address: latestTransactions[i].to,
          date: sDate.toISOString(),
          sent: sent,
          user: (sent === true? toUsername: fromUsername),
          amount: latestTransactions[i].amount
        });
      }
    }
    var data = {
      balance,
      latestTransactions: transactions,
    }
    return data;
  },


  getWalletProfile: async(username) => {
    let profileData = await WalletService.findProfiles([username]);
    let profile = profileData[username];
    const st = SeedTokenAPIClientEthereumETHPersonal.getInstance(process.env.PARITY_URL);
    let balance = await st.getBalance(profile.walletAddress);
    var data = {
      profile,
      balance,
    }
    return data;
  },


  findProfiles: async(keywords) => {
    let url = process.env.ACCOUNTS_URL + '/api/profiles/search';
    let params = '';
    for (let i = 0; i < keywords.length; i++) {
      params += (params === ''? '?': '&') + 'q[]=' + encodeURIComponent(keywords[i]);
    }
    url += params;
    let response = await fetch(url, { headers: { 'Accounts-API-Key': process.env.ACCOUNTS_API_KEY } });
    let data = await response.json();
    // convert data to array with keys
    let results = [];
    for (let i = 0; i < data.length; i++) {
      results[data[i].keyword] = data[i].profile;
    }
    return results;
  },

  send: async(username, to, amount, confirmed) => {
    let transaction = new Transaction({
      username,
      to,
      amount,
    });
    await Transaction.check(transaction);
    let profiles = await WalletService.findProfiles([username, to]);
    if (!profiles[username]) {
      throw new WalletNotFoundError();
    }
    if (!profiles[to]) {
      let err = new ValidationError(null);
      err.addError('to', new ValidatorError());
      err.errors.to.message = 'domain.wallet.validation.recipient_not_found';
      throw err;
    }
    if (profiles[username].walletAddress === profiles[to].walletAddress) {
      let err = new ValidationError(null);
      err.addError('to', new ValidatorError());
      err.errors.to.message = 'domain.wallet.validation.self_transfer_error';
      throw err;
    }
    const st = SeedTokenAPIClientEthereumETHPersonal.getInstance(process.env.PARITY_URL);
    /* let balance = await st.getBalance(profiles[username].walletAddress);
    let usernameBalance = new BigNumber(balance);
    if (usernameBalance.isLessThan(amount)) {
      let err = new ValidationError(null);
      err.addError('amount', new ValidatorError());
      err.errors.amount.message = 'domain.wallet.validation.insufficient_funds';
      throw err;
    } */
    if (!confirmed) {
      return {
        'toWalletAddress': profiles[to].walletAddress
      };
    } else {
      let transactionId = '';
      try {
        transactionId = await st.transfer(
          profiles[username].walletAddress,
          profiles[to].walletAddress,
          amount,
          process.env.PARITY_TEST_ADDRESS_PASSPHRASE
        );
      } catch (err) {
        if (err.toString().includes('Insufficient funds')) {
          let verr = new ValidationError(null);
          verr.addError('amount', new ValidatorError());
          verr.errors.amount.message = 'domain.wallet.validation.insufficient_funds';
          throw verr;
        } else {
          throw err;
        }
      }
      return {
        'transactionId': transactionId
      };
    }
  }
}

module.exports = {
  WalletService,
}

