var app = angular.module("myapp", []);
app.controller("myctrl", function ($scope, $http) {

    $scope.student = [];
    $scope.st = {};
    $http.get("/db/Students.js").then(
        function (res) {
            $scope.student = res.data;
        },
        function (res) {
            alert("fail!");
        });
    $scope.check = function () {
        $scope.recheck();
        const e = $scope.student.find(element => element.username == $scope.user);
        if (e.username == $scope.user && e.password == $scope.pw) {
            window.location.href = '/Layout.html';
        } else if (e.password != $scope.pw) {
            alert("Mật khẩu sai!");
        } else if ($scope.student.find(element => element.username != $scope.user)) {
            alert("Tên đăng nhập không tồn tại!");
        } else {
            alert("đăng nhập thất bại!");
        }

    };

    $scope.checkuser = function () {
        const el = $scope.student.find(element => element.email == $scope.e);
        if (el.username == $scope.ten && el.email == $scope.e) {
            alert("Mật khẩu của bạn là: " + el.password);
        } else {
            alert("email hoac tên đăng nhập sai!")
        }
    };
    $scope.st.gender = "Nam";
    $scope.insert = function () {
        $scope.student.push(angular.copy($scope.st));
        alert("đăng kí thành công!");
        
    };

    $scope.recheck = function () {
        $scope.student.push(angular.copy($scope.st));
        if ($scope.user == $scope.st.name && $scope.pw == $scope.st.pass) {
            window.location.href = '/Layout.html';
        }
    }

});

