App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  _instance: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // initialize web3
    if(typeof web3 !== 'undefined') {
      //reuse the provider of the Web3 object injected by Metamask
      App.web3Provider = web3.currentProvider;
    } else {
      //create a new provider and plug it directly into our local node
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    };
    web3 = new Web3(App.web3Provider);

    App.displayAccountInfo();

    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(function(err, account){
      if(err === null) {
        App.account = account;
        $("#account").text(account);
        web3.eth.getBalance(account, function(err, balance) {
          if(err === null) {
            $("#accountBalance").text(web3.fromWei(balance, "ether") + " ETH")
          };
        });
      };
    });
  },

  initContract: function() {
    $.getJSON('Guess4.json', function(guess4Artifact) {
      //use to instantiate truffle contract abstraction
      App.contracts.Guess4 = TruffleContract(guess4Artifact);
      //  connect contract to provider for contract
      App.contracts.Guess4.setProvider(App.web3Provider);
    })
  },

  createGuesses: function() {
    var _guess0 = $("#input_guess0").val();
    var _guess1 = $("#input_guess1").val();
    var _guess2 = $("#input_guess2").val();
    var _guess3 = $("#input_guess3").val();

    $("#result_string").hide();

    App.contracts.Guess4.deployed().then(function(instance) {
      _instance = instance;
      return _instance.createGuesses(_guess0, _guess1, _guess2, _guess3,{from:App.account,gas: 500000})
    }).then(function(result) {
      console.log(result)
      //return _instance.testCalls();
    // }).then(function(result) {
      $("#result_string").text(result[1]);
      $("#result_string").fadeIn('slow');
     });

  // testCalls: function() {
  //   _instance.testCalls().then(function(results) {
  //   });
  },

  getArray: function() {
    _instance.getArray().then(function(array){
      $("#correct_0").text(array[0].toNumber());
      $("#correct_1").text(array[1].toNumber());
      $("#correct_2").text(array[2].toNumber());
      $("#correct_3").text(array[3].toNumber());
      console.log(array[4].toNumber());
    });
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  });
});
