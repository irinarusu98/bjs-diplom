'use strict';        //Подключите строгий режим выполнения кода.

//Создайте объект класса UserForm
document.addEventListener('DOMContentLoaded', () => {
    const userForm = new UserForm();


    //Присвойте свойству loginFormCallback созданного объекта значение функции, которая в качестве аргумента принимает объект data (объект, который содержит логин и пароль, введённые в форму, и который будет передаваться внутри loginFormAction).
    userForm.loginFormCallback = function (data) {

        ApiConnector.login(data, (response) => {            // Выполняем запрос на авторизацию через ApiConnector.login
            console.log('Server response:', response);
            if (response.success) {
                console.log('Login successful');
                location.reload();                           // В случае успеха запроса обновите страницу (с помощью location.reload();)
            } else {
                userForm.setLoginErrorMessage(response.error);  //В случае провала запроса выведите ошибку в окно для ошибок
            }
        });
    };

    userForm.registerFormCallback = function (data) {
        // Выполняем запрос на регистрацию через ApiConnector.register
        ApiConnector.register(data, (response) => {
            console.log('Server response (register):', response); // Посмотрите ответ сервера в консоли

            if (response.success) {
                console.log('Registration successful');
                location.reload();                                  // Обновляем страницу после успешной регистрации
            } else {
                userForm.setRegisterErrorMessage(response.error);     //Сообщение об ошибке
            }
        });
    };
});
