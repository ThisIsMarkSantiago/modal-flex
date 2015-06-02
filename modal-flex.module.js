'use strict';

angular.module('modalFlex', [
  'ui.bootstrap'
  ]).factory('$fmodal', function ($modal) {
    var templateUrl = 'bower_components/modal-flex/modal-flex.html';
    return {
      open: function(data, success, cancel){
        var modalInstance = $modal.open({
          templateUrl: templateUrl,
          controller: 'fmodal.controller',
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
  $scope.method = !data.method || ['show', 'edit', 'delete'].indexOf(data.method.toLowerCase()) < 0 ? "show" : data.method.toLowerCase();
  $scope.type = data.type ? data.type : "object";
  $scope.okText = data.okText ? data.okText : 'Save';
  $scope.cancelText = data.cancelText ? data.cancelText : 'Cancel';
  $scope.titleText = data.titleText;
  $scope.displayCancel = data.displayCancel ? data.displayCancel : true;
  $scope.icons = data.icons ? data.icons : true;
  $scope.message = $sce.trustAsHtml(data.message);
  $scope.data = data.object ? angular.copy(data.object) : {}; // Clone

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

  $scope.isRequired = function(key){
    if(!data || !data.required || data.required.indexOf(key) < 0) return false;
    return true;
  };

  $scope.keys = function(obj){
    return obj? Object.keys(obj) : [];
  };

  $scope.getType = function(key){
    if(data){
      if(data.options && data.options.filter(function(obj){ return obj.key == key }).length > 0) return "option";
      else if(data.radios && data.radios.filter(function(obj){ return obj.key == key }).length > 0) return "radio";
      else if(data.numbers && data.numbers.indexOf(key) >= 0) return "number";
      else if(data.passwords && data.passwords.indexOf(key) >= 0) return "password";
      else if(data.emails && data.emails.indexOf(key) >= 0) return "email";
      else if(data.checkboxes && data.checkboxes.indexOf(key) >= 0) return "checkbox";
      else if(data.textAreas && data.textAreas.indexOf(key) >= 0) return "text-area";
    }
    return "text";
  };

  $scope.specialType = function(type){
    return ["text-area", "option", "radio"].indexOf(type) >= 0;
  };

  $scope.getOptions = function(key){
    if(data){
      var options = data.options ? data.options : data.radios;
      if(options){
        var option = options.filter(function(obj){ return obj.key == key })
        if(option.length > 0){
          return option[0].options;
        }
      }
    }
    return [];
  };

  for(var datum in $scope.data){
    if(["option", "radio"].indexOf($scope.getType(datum)) >= 0){
      $scope.data[datum] = $scope.data[datum] ? ($scope.data[datum].id || $scope.data[datum]) : $scope.data[datum];
    }
  };

  $scope.ok = function () {
    $scope.showFormErrors = false;
    if($scope.modalFlexForm.$valid){
      if(!data.onOk) return $modalInstance.close($scope.data);
      data.onOk( $scope.data, function(data){
        $modalInstance.close(data ? data : $scope.data);
      }, function(errors){ 
        $scope.errors = $sce.trustAsHtml(errors);
      });
    } else {
      $scope.showFormErrors = true;
    }
  };

  $scope.cancel = function () {
    if(!data.onCancel) return $modalInstance.dismiss($scope.data);
    data.onCancel($scope.data, function(message){ $modalInstance.dismiss(message ? message : 'cancel'); });
  };
});