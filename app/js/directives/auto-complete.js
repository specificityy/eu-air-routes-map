define(['angular', 'directives/directives'], function(angular, directives) {

  return directives.directive("autoComplete", function($timeout) {

    return {
      restrict: 'AE',
      scope: {
        selectedTags: '=model',
        searchList: '='
      },
      templateUrl: 'app/partials/directives/auto-complete.html',
      link: function(scope, elem, attrs) {

        scope.search = function() {
          if (!scope.searchList) return;

          if (scope.searchList[0] instanceof Object) {

            scope.suggestions.length < 1 && setSuggestions();

            angular.forEach(scope.searchList, function(item, key) {
              if (!checkSearchObject(item, scope.vm.searchText)) {
                removeSuggestion(item[scope.searchDisplay]);
              }
            });

            console.log(scope.suggestions)

          } else {
            (scope.searchList.indexOf(scope.vm.searchText) === -1) && scope.searchList.unshift(scope.vm.searchText);
            scope.suggestions = scope.searchList;
          }

          scope.selectedIndex = -1;
        }

        function checkSearchObject(obj, search) {
          var keepGoing = true,
            ret = false;
          angular.forEach(obj, function(val, key) {
            if (keepGoing) {
              var check = new RegExp(search, 'i');
              ret = check.test(val);
              keepGoing = false;
            }
          });
          return ret;
        }

        function setSuggestions() {
          angular.forEach(scope.searchList, function(item, key) {
            (scope.suggestions.indexOf(item.name) == -1) && scope.suggestions.push(item.name);
          });
        }

        function removeSuggestion(item) {
          scope.suggestions.splice(scope.suggestions.indexOf(item), 1);
        }

        scope.suggestions = [];

        scope.selectedTags = [];

        scope.selectedIndex = -1; //currently selected suggestion index

        scope.checkKeyDown = function(event) {
          if (event.keyCode === 40) { //down key, increment selectedIndex
            event.preventDefault();
            if (scope.selectedIndex + 1 !== scope.suggestions.length) {
              scope.selectedIndex++;
            }
          } else if (event.keyCode === 38) { //up key, decrement selectedIndex
            event.preventDefault();
            if (scope.selectedIndex - 1 !== -1) {
              scope.selectedIndex--;
            }
          } else if (event.keyCode === 13) { //enter pressed
            scope.addToSelectedTags(scope.selectedIndex);
          }
        }

        scope.addToSelectedTags = function(index) {
          scope.suggestions = [];
        }


        scope.$watch('selectedIndex', function(val) {
          if (val !== -1) {
            scope.vm.searchText = scope.suggestions[scope.selectedIndex];
          }
        });

      }
    }

  });

});