'use strict';

angular.module('modalFlex', [
  'ui.bootstrap'
  ]).factory('fmodal', function () {
    return {
      open: function(data, success, cancel){
        $modal.open({
          templateUrl: 'modal-flex.html',
          controller: 'ModalHelperController',
          resolve: {
              data: function(){
                  return data
              }
          }
        });
        modalInstance.result.then(success,cancel);
      }
    }
  })
.controller('fmodal.controller', function($scope, $sce, $modalInstance, data) {
  $scope.method = data.method ? data.method : "show";
  $scope.type = data.type ? data.type : "object";
  $scope.data = angular.copy(data.object); // Clone

  $scope.parseData = function(datum){
    var obj = {};
    var keys = $scope.keys(data.object);
    if(data.show){
      for (var i = 0; i < data.show.length; i++) {
        if(keys.indexOf(data.show[i]) >= 0){
          if(typeof data.object[data.show[i]] == "object" && data.object[data.show[i]] !=  null) obj[data.show[i]] = data.object[data.show[i]].name ? data.object[data.show[i]].name : data.object[data.show[i]].username;
          else obj[data.show[i]] = data.object[data.show[i]];
        }
      };
    } else {
      for (var i=0; i<keys.length; i++){
        if(typeof data.object[keys[i]] == "object" && data.object[keys[i]] !=  null) obj[keys[i]] = data.object[keys[i]].name ? data.object[keys[i]].name : data.object[keys[i]].username;
        else obj[keys[i]] = data.object[keys[i]];
      }
    }
    return obj;
  };

  $scope.isReadOnly = function(key){
    if(!data || !data.readOnly || data.readOnly.indexOf(key) < 0) return false;
    return true;
  };

  $scope.keys = function(obj){
    return obj? Object.keys(obj) : [];
  };

  $scope.getType = function(key){
    if(data && data.options && data.options.filter(function(obj){ return obj.key == key }).length > 0) return "option";
    return "text";
  };

  $scope.getOptions = function(key){
    if(data && data.options){
      var option = data.options.filter(function(obj){ return obj.key == key })
      if(option.length > 0){
        return option[0].options;
      }
    }
    return [];
  };

  for(var datum in $scope.data){
    if($scope.getType(datum) == 'option'){
      $scope.data[datum] = $scope.data[datum] ? ($scope.data[datum].id || $scope.data[datum]) : $scope.data[datum];
    }
  };

  $scope.ok = function () {
    if(!data.onSuccess) return $modalInstance.close($scope.data);
    data.onSuccess( $scope.data, function(data){
      $modalInstance.close(data ? data : $scope.data);
    }, function(errors){ 
      $scope.errors = $sce.trustAsHtml(errors);
    });
  };

  $scope.cancel = function () {
    if(!data.onCancel) return $modalInstance.dismiss($scope.data);
    data.onCancel($scope.data, function(message){ $modalInstance.dismiss(message ? message : 'cancel'); });
  };
});