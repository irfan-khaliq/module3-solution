var app = angular.module('NarrowItDownApp',[]);
app.controller('NarrowItDownController',NarrowItDownController);
app.service('MenuSearchService',MenuSearchService);
app.directive('foundItems',foundItems );
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService)
{
  var ctrl = this;
  ctrl.searchText = "";
  ctrl.message=false;
  ctrl.loader = false;
  ctrl.search = function()
  {

    if(ctrl.searchText == '')
      {
        ctrl.message=true;
        return;
      }
      ctrl.message=false;
      ctrl.loader = true;
    MenuSearchService.getMatchedMenuItems(ctrl.searchText).then(function(data){
      if(data.length ==0)
        ctrl.message=true;
      ctrl.found = data;
      ctrl.loader = false;
    });

  }
  ctrl.onRemove = function(index)
  {
    ctrl.found.splice(index,1);

  }
}
function foundItems()
{
  var ddo = {
    templateUrl:'menulist.html',
    scope:{
      items:'=',
      onRemove:'&'
        }
  }
  return ddo;
}
MenuSearchService.$inject = ['$http']
function MenuSearchService($http)
{
  var service = {};
  service.getMatchedMenuItems=function(searchText)
  {
    var foundItems = [];
    var promise =$http.get('https://davids-restaurant.herokuapp.com/menu_items.json').then(
      function(response)
      {
        var menuItems = response.data.menu_items;
      angular.forEach(menuItems,function(item)
        {
          if(item.description.indexOf(searchText) > -1)
            foundItems.push(item);
        });
        return foundItems;
      });
      return promise;
  }
  return service;
}
