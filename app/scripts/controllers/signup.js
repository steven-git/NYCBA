'use strict';

angular.module('nycbaApp')
  .controller('SignupCtrl', function ($scope, $http, $route, $location) {
    
    $scope.players=[{},{},{},{},{},{},{},{}];

    $scope.states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'];

    $scope.ccTypes = ['Visa', 'Mastercard', 'American Express'];

    $scope.expirationMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    $scope.expirationYear = [2014, 2015, 2016, 2017, 2018, 2019, 2020];

    $scope.agreed = false;

    $scope.confirmation = false;

    $scope.newTeam = {
        name: '',
        captain: {
            name: {
                first: '',
                last: ''
            },
            cell: '',
            email: ''
        },
        coCaptain: {
            name: {
                first: '',
                last: ''
            },
            cell: '',
            email: ''
        },
        players: [],
        cc: {
            name: {
                first: '',
                last: ''
            },
            address1: '',
            address2: '',
            state: '',
            phone: '',
            email: '',
            cardType: '',
            nameOnCard: '',
            number: '',
            expiration: {
                month: '',
                year: ''
            },
            security: ''
        }
    };

    $scope.addTeam = function(){
        $scope.newTeam.players = [];
        if (!$scope.agreed){
            alert('please, agree to terms and conditions');
        }
        else{

            for (var i = 0; i < $scope.players.length; i++){
                // console.log('$scope.players[i] ' + $scope.players[i].name);
                if ($scope.players[i].name !== undefined){
                    if ($scope.players[i].name !== ''){
                        $scope.newTeam.players.push($scope.players[i].name)
                    }
                }
            }

            // console.log('we have ' + $scope.newTeam.players.length + ' players');

            if (verifyForm()){
                $http.post('/api/signUpMail', $scope.newTeam)
                  .success(function(data){
                    // console.log('success');
                    $scope.confirmation = true;
                  });
            }
        }
    };

    function verifyForm() {
        // console.log('$scope.newTeam.cc.cardType ' + $scope.newTeam.cc.cardType);

        if ($scope.newTeam.name === ''){
            alert('missing team name');
            return false;
        }

        if ($scope.newTeam.captain.name.first === ''){
            alert('missing captains first name');
            return false;
        }

        if ($scope.newTeam.captain.name.last === ''){
            alert('missing captains last name');
            return false;
        }

        if ($scope.newTeam.captain.cell === ''){
            alert('missing captains cell number');
            return false;
        }

        if ($scope.newTeam.captain.email === ''){
            alert('missing captains email');
            return false;
        }

        if ($scope.newTeam.captain.email !== $scope.newTeam.captain.emailConfirm){
            alert('captains email and its confirmation do not match');
            return false;
        }

        if ($scope.newTeam.coCaptain.name.first === ''){
            alert('missing co-captains first name');
            return false;
        }

        if ($scope.newTeam.coCaptain.name.last === ''){
            alert('missing co-captains last name');
            return false;
        }

        if ($scope.newTeam.coCaptain.cell === ''){
            alert('missing co-captains cell number');
            return false;
        }

        if ($scope.newTeam.coCaptain.email === ''){
            alert('missing co-captains email');
            return false;
        }

        if ($scope.newTeam.coCaptain.email !== $scope.newTeam.coCaptain.emailConfirm){
            alert('co-captains email and its confirmation do not match');
            return false;
        }

        if ($scope.newTeam.players.length < 3){
            alert('the team must have at least 5 players');
            return false;
        }

        if ($scope.newTeam.cc.name.first === ''){
            alert('missing the first name from the credit card billing');
            return false;
        }

        if ($scope.newTeam.cc.name.last === ''){
            alert('missing last name from the credit card billing');
            return false;
        }

        if ($scope.newTeam.cc.address1 === ''){
            alert('missing the first addess line from the credit card billing');
            return false;
        }

        if ($scope.newTeam.cc.state === ''){
            alert('please select state for the credit card billing');
            return false;
        }

        if ($scope.newTeam.cc.phone === ''){
            alert('missing the phone number from the credit card billing');
            return false;
        }

        if ($scope.newTeam.cc.email === ''){
            alert('missing the email from the credit card billing');
            return false;
        }

        if ($scope.newTeam.cc.cardType === ''){
            alert('please select credit card type');
            return false;
        }

        if ($scope.newTeam.cc.nameOnCard === ''){
            alert('missing name on the credit card');
            return false;
        }

        //check for the patterns corresponding to the selected credit card type
        if ($scope.newTeam.cc.number.length === ''){
            alert('missing the credit card number');
            return false;
        }

        if (($scope.newTeam.cc.cardType === 'American Express') && ($scope.newTeam.cc.number.length !== 15)){
            alert('there should be 16 digits in the card number!');
            return false;
        }

        if (($scope.newTeam.cc.cardType !== 'American Express') && ($scope.newTeam.cc.number.length !== 16)){
            alert('there should be 15 digits in the card number!');
            return false;
        }

        //check for the month to be after this month
        if ($scope.newTeam.cc.expiration.month === ''){
            alert('please select the expiration month of the credit card');
            return false;
        }

        if ($scope.newTeam.cc.expiration.year === ''){
            alert('please select the expiration year of the credit card');
            return false;
        }

        //check for the patterns corresponding to the selected credit card type
        if ($scope.newTeam.cc.security === ''){
            alert('missing the credit cards security code');
            return false;
        }

        if (($scope.newTeam.cc.cardType === 'American Express') && ($scope.newTeam.cc.security.length !== 4)){
            alert('the security code for Amex should be 4 digits long!');
            return false;
        }

        if (($scope.newTeam.cc.cardType !== 'American Express') && ($scope.newTeam.cc.security.length !== 3)){
            alert('the security code should be 3 digits long!');
            return false;
        }

        return true;

    };

  });