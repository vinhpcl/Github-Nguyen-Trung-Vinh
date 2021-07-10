var app = angular.module("myapp", ["ngRoute", 'angularUtils.directives.dirPagination']);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/trangchu", {
            templateUrl: "trangchu.html",
            controller: "sjctrl"
        })
        .when("/quiz/:id/:name", {
            templateUrl: "quiz.html",
            controller: "quizctrl"
        })
        .when("/gioithieu", {
            templateUrl: "gioithieu.html"
        })
        .when("/lienhe", {
            templateUrl: "lienhe.html"
        })
        .when("/gopy", {
            templateUrl: "gopy.html"
        })
        .when("/hoidap", {
            templateUrl: "hoidap.html"
        })
        .when("/doimk", {
            templateUrl: "doimk.html"
        })
        .when("/suahoso", {
            templateUrl: "suahoso.html"
        })
        .otherwise({
            redirectTo: "/trangchu"
        });
});

app.controller("quizctrl", function ($http, $routeParams, quizfactory) {

    $http.get('/db/Quizs/' + $routeParams.id + '.js').then(function (res) {
        quizfactory.questions = res.data;
    });

});
app.controller("sjctrl", function ($scope, $http) {
    $scope.list_sj = [];
    $http.get('/db/Subjects.js').then(function (res) {
        $scope.list_sj = res.data;
    });

});
app.directive("quiz", function (quizfactory, $routeParams, $interval) {
    return {
        restrict: "AE",
        scope: {},
        templateUrl: "quiz1.html",
        link: function (scope, elem, attrs) {
            scope.start = function () {
                quizfactory.getQuestions().then(function () {
                    scope.sjname = $routeParams.name;
                    scope.id = 1;
                    scope.quizend = false;
                    scope.inProgess = true;
                    scope.getQuestion();
                    scope.startTime();
                });
            };
            scope.reset = function () {
                scope.inProgess = false;
                scope.score = 0;
            };
            scope.end = function () {
                scope.quizend = true;
                // scope.inProgess = false;
                // scope.stoptime();
                window.location.href = '/Layout.html';
            };
            scope.getQuestion = function () {
                var q = quizfactory.getQuestion(scope.id);
                if (q) {
                    scope.question = q.Text;
                    scope.options = q.Answers;
                    scope.answer = q.AnswerId;
                    scope.answerMode = true;
                } else {
                    scope.quizend = true;
                }
            }
            scope.checkAnswer = function () {
                if (!$("input[name=answer]:checked").length) return;
                var ans = $("input[name=answer]:checked").val();
                if (ans == scope.answer) {
                    scope.score++;
                    scope.correctAns = true;
                } else {
                    scope.correctAns = false;
                }
                scope.answerMode = false;
            };
            scope.nextQuestion = function () {
                if (scope.id <= 10) {
                    scope.id++;
                }
                scope.getQuestion();
            };
            function getms(duration) {
                var minutes = parseInt(duration / 60, 10);
                var seconds = parseInt(duration % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                return {
                    minutes: minutes,
                    seconds: seconds
                };
            };
            var time;
            scope.timer = {};
            scope.timer.value = 60 * 1;
            scope.startTime = function () {
                function countdown() {
                    var ms = getms(scope.timer.value);
                    scope.timer.minutes = ms.minutes;
                    scope.timer.seconds = ms.seconds;
                    if (--scope.timer.value < 0) {
                        scope.timer.value = 0;
                        scope.end();
                    }
                }
                countdown();
                time = $interval(function () {
                    countdown();
                }, 1000);
            };

            scope.stoptime = function () {
                $interval.cancel(time);
            };
            scope.reset();
        }
    };
});

app.factory("quizfactory", function ($http, $routeParams) {

    return {
        getQuestions: function () {
            return $http.get('/db/Quizs/' + $routeParams.id + '.js').then(function (res) {
                questions = res.data;
            });
        },
        getQuestion: function (id) {
            var random = questions[Math.floor(Math.random() * questions.length)];
            var count = questions.length;
            if (count > 10) {
                count = 10;
            };
            if (id < count) {
                return random;
            } else {
                return false;
            }
        }
    }
});
