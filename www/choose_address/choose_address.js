angular.module('foodMeApp.chooseAddress', ['ngRoute', 'ngTouch', 'foodmeApp.localStorage', 'foodmeApp.sharedState'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/choose_address', {
    templateUrl: 'choose_address/choose_address.html',
    controller: 'ChooseAddressCtrl'
  });
}])

.controller('ChooseAddressCtrl', ["$scope", "$location", "fmaLocalStorage", "$http", "fmaSharedState", "$rootScope", "$timeout",
function($scope, $location, fmaLocalStorage, $http, fmaSharedState, $rootScope, $timeout) {
  var mainViewObj = $('#main_view_container');

  // On this screen, we need a valid user token. If we are missing one, we need
  // to go back to the intro_screen to get it.
  console.log('In choose_address controller.');
  $scope.userToken = fmaLocalStorage.getObject('userToken');
  $scope.rawAccessToken = null;
  if (fmaSharedState.fake_token) {
    alert('Warning-- you are using a fake access token.');
    console.log('Fake access token being used.');
    $scope.rawAccessToken = fmaSharedState.fake_token;
  } else if ($scope.userToken != null && _.has($scope.userToken, 'access_token')) {
    $scope.rawAccessToken = $scope.userToken.access_token;
  }
  if ($scope.rawAccessToken == null) {
    alert('In order to choose an address, we need you to log in first.');
    mainViewObj.removeClass();
    mainViewObj.addClass('slide-right');
    $location.path('/intro_screen');
    return;
  }
  // If we get here, we have a valid user token.

  $scope.isLoading = true;
  var loadStartTime = (new Date()).getTime();
  // The location the user wants to use when looking for restaurants. This is an
  // object so we can use it in ng-repeat without scope issues.
  $scope.selectedLocationIndex = { value: null };
  $scope.locationList = {};
  $http.defaults.headers.common.Authorization = $scope.rawAccessToken;
  $http.get(fmaSharedState.endpoint+'/customer/location?client_id=' + fmaSharedState.client_id).then(
    function(res) {
      $scope.locationList = res.data.locations;
      var currentAddress = fmaLocalStorage.getObject('userAddress');
      if (currentAddress != null) {
        for (var i = 0; i < $scope.locationList.length; i++) {
          if ($scope.locationList[i].location_id === currentAddress.location_id) {
            $scope.selectedLocationIndex.value = i;
            break;
          }
        }
      }
      // Make the loading last at least a second.
      var timePassedMs = (new Date()).getTime() - loadStartTime;
      $timeout(function() {
        $scope.isLoading = false;
      }, Math.max(fmaSharedState.minLoadingMs - timePassedMs, 0));
    },
    function(err) {
      alert('Error fetching addresses: ' + err.statusText);
      // This is a hack since we don't refresh our token.
      fmaLocalStorage.setObject('userToken', null);
      fmaSharedState.fake_token = null;
      console.log("Using an expired token!");
      mainViewObj.removeClass();
      mainViewObj.addClass('slide-right');
      $location.path('/intro_screen');
      return;
  });

  $scope.doneButtonPressed = function() {
    console.log('Done button pressed.');
    // Save the chosen address and proceed.
    var chosenLocIndex = $scope.selectedLocationIndex.value;
    if (chosenLocIndex !== null) {
      console.log("Setting userAddress!");
      fmaLocalStorage.setObjectWithExpirationSeconds(
          'userAddress', $scope.locationList[chosenLocIndex],
          fmaSharedState.testing_invalidation_seconds);
      mainViewObj.removeClass();
      mainViewObj.addClass('slide-left');
      console.log('added class...');
      $location.path('/choose_cuisine');
      return;
    }
    console.log("Need to select an address.");
    alert("Dude. You have to select an address.");
  };
  $scope.addAddressButtonPressed = function() {
    console.log('Add address button pressed.');
    mainViewObj.removeClass();
    mainViewObj.addClass('slide-left');
    $location.path('/add_address');
    return;
  };

  // Set the selected location index when a user taps a cell.
  $scope.cellSelected = function(indexSelected) {
    console.log('Cell selected: ' + indexSelected);
    $scope.selectedLocationIndex.value = indexSelected;
  };
  
}]);
