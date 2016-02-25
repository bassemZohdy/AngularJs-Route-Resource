var app = angular.module('app', ['ngRoute','ngResource']);
app.directive('resourceDirective', function() {
  return {
    scope:{
      resource : "=resource"
    },
    templateUrl: 'templates/resource.html'
  };
});
app.factory('Resources', ['$resource', function ($resource) {
  return $resource('data/resource/:id',{id:'@id'},
  {
    'query':  {method:'GET',url: 'data/resources', isArray:true},
    'list': {method:'GET', url: 'data/rest/:reourceName',params:{reourceName:'@reourceName'} , isArray:true},
    'getData': {method:'GET', url: 'data/rest/:reourceName/:id',params:{reourceName:'@reourceName',id:'@id'}}
  });
}]);
// app.factory('ResourceData', ['$resource', function ($resource) {
//   return $resource('data/rest/:reourceName',{reourceName:'@reourceName'},
//   {
//     'query':  {method:'GET', isArray:true}
//   });
// }]);
app.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
  when('/home',{
    templateUrl: 'views/home.html',
    controller: 'homeCtrl',
    resolve:{
      list:function(Resources){
        return Resources.query().$promise;
      }
    }
  }).
  when('/resource/:id', {
    templateUrl: 'views/resource/list.html',
    controller: 'resourceListCtrl',
    resolve:{
      resource:function($route,$q,Resources){
        var defer = $q.defer();
        var id = $route.current.params.id;
        var r = Resources.get({},{id:id}).$promise;
        r.then(function(resource){
          var l = Resources.list({},{reourceName:resource.name}).$promise;
          l.then(function(list){
            resource.list = list;
            defer.resolve(resource);
          })
        });
        return defer.promise;
      }
    }
  }).
  when('/resource/:resourceName/:id', {
    templateUrl: 'views/resource/detail.html',
    controller: 'resourceDetailCtrl',
    resolve:{
      resource:function($route,$q,Resources){
        var defer = $q.defer();
        var resourceName = $route.current.params.resourceName;
        var id = $route.current.params.id;
        var r = Resources.getData({},{reourceName:resource.name,id:id}).$promise;
        // get resource and add data
        return r;
      }
    }
  }).
  otherwise({
    redirectTo: '/home'
  });
}]);
app.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
app.controller('homeCtrl',function($scope,list){
  $scope.list = list;
});
app.controller('resourceListCtrl',function($scope,resource){
  $scope.resource = resource;
  console.log($scope.resource);
});
