(function(app) {


    app.service('EstudiosVigentesServices', function ($resource) {

        var resource = $resource('/eye-tracking-api/estudiosvigentes', {}, {
            query: {
                method: 'GET',
                headers: [
                    {'Content-Type':'application/json'}],
                isArray: true
            },
            create: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            }

        });

        var resource2 = $resource('/eye-tracking-api/estudiosvigentes/:id', {}, {

            delete:{
                method: 'DELETE'
            },
        });

        this.getEstudiosVigentes = function getEstudiosVigentes(){
            return resource.query({}).$promise;
        };
        this.createEstudioVigente = function createEstudiosVigente(estudiovigente){
            return resource.create(estudiovigente);
        };
        this.deleteEstudioVigenteById = function deleteEstudioVigenteById(id){
            return resource2.delete({id: id});
        };
        this.updateEstudioVigente = function updateEstudioVigente(estudiovigente){
            return resource.update(estudiovigente);
        }

    });

    app.controller('EstudiosVigentesController', function($scope, $resource, $state, $mdDialog, $rootScope, $mdToast, estudiosvigentes, EstudiosVigentesServices) {

        'use strict';


        'use strict';


        $scope.showSimpleToast = function(text) {

            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .hideDelay(3000)
            );
        };

        $scope.estudiosvigentes = estudiosvigentes;

        $scope.query = [];

        $scope.search = function (row) {
            var isIt = (angular.lowercase(row.nombreDeEstudio).indexOf(angular.lowercase($scope.query) || '') !== -1 );

            return isIt;
        };

        $scope.goBack = function(){
            $state.go('home');
        }


        $scope.$watch('query', function () {
            if($scope.query.length > 0) {
                $scope.query.toLowerCase();
            }
        });

        $scope.createNew = function (ev) {

            var estudiovigente = {

                fechaCreacion: Date.now()
            }

            $scope.showDetails(ev, estudiovigente);
        };

        $scope.update = function (ev, estudiovigente) {


            $scope.showDetails(ev, estudiovigente, true);
        };

        $scope.showDetails = function (ev, estudiovigente, alreadyExists) {
            $mdDialog.show({
                templateUrl: 'partials/estudiosvigentes.dialog.html',
                targetEvent: ev,
                clickOutsideToClose: false,
                controller: 'EstudiosVigentesDialog',
                escapeToClose: true,
                locals: {estudiovigente: estudiovigente, alreadyExists: alreadyExists},
                focusOnOpen: true
            }).then(function (estudiovigente) {

                if(estudiovigente.$$alreadyExists){
                    $scope.showSimpleToast("Cambios Guardados");
                    estudiovigente.fechaUltimaModificacion = Date.now();

                    EstudiosVigentesServices.updateEstudioVigente(estudiovigente);

                }else{
                    $scope.estudiosvigentes.push(estudiovigente);

                    EstudiosVigentesServices.createEstudioVigente(estudiovigente);

                    $scope.showSimpleToast("Estudio Creado");
                }


            });

        };

    })

    .controller('EstudiosVigentesDialog', function ($scope, $mdDialog, estudiovigente, alreadyExists) {

        $scope.estudiovigente = estudiovigente;
        if(alreadyExists){
            $scope.estudiovigente.$$alreadyExists = alreadyExists;
        }

        $scope.saveEstudio = function saveEstudio() {
            $mdDialog.hide($scope.estudiovigente);
        };

        $scope.closeDialog = function () {
            $mdDialog.cancel();
        };

        estudiovigente.nombreDeEstudio

        $scope.canSave = function(){
            if($scope.estudiovigente.nombreDeEstudio && $scope.estudiovigente.precio && $scope.estudiovigente.descripcion){
                return false;
            }
            return true;
        };

    })
})(eyetracking);
