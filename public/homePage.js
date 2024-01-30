const logoutButton = new LogoutButton();             //Создайте объект класса LogoutButton

//В свойство action запишите функцию, которая будет вызывать запрос деавторизации (logout)
logoutButton.action = function () {
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload();                        //если запрос выполнился успешно, то обновите страницу
        }
    });
};

//Выполните запрос на получение текущего пользователя (current)
ApiConnector.current((response) => {
    if (response.success) {
        ProfileWidget.showProfile(response.data);     //если ответ успешный, то вызовите метод отображения данных профиля 
    }
});

//Получение текущих курсов валюты
//Создайте объект типа RatesBoard
const ratesBoard = new RatesBoard();

//Напишите функцию, которая будет выполнять запрос получения курсов валют.
function updateExchangeRates() {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            ratesBoard.clearTable();                       // в случае успешного запроса, очищайте таблицу с данными (clearTable) и заполняйте её (fillTable) полученными данными
            ratesBoard.fillTable(response.data);
        }
    });
}

updateExchangeRates();

setInterval(updateExchangeRates, 60000);                   //Напишите интервал, который будет многократно выполняться (раз в минуту) и вызывать вашу функцию с получением валют.


//Операции с деньгами

const moneyManager = new MoneyManager();                    //Создайте объект типа MoneyManager

//Реализуйте пополнение баланса:
moneyManager.addMoneyCallback = function (data) {
    ApiConnector.addMoney(data, (response) => {             //  запрос на пополнение баланса (addMoney)
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            const successMessage = `Баланс успешно пополнен на ${data.amount} ${data.currency}`;
            moneyManager.setMessage(true, successMessage);
            moneyManager.updateUsersList(response.data);
        } else {
            const errorMessage = `Ошибка при пополнении баланса: ${response.error}`;
            moneyManager.setMessage(false, response.error);
        }
    });
};


//  Реализуйте конвертирование валюты:
moneyManager.conversionMoneyCallback = function (data) {
    ApiConnector.convertMoney(data, (response) => {               //запрос на конвертацию баланса
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            const successMessage = `Конвертация выполнена: ${data.fromAmount} ${data.fromCurrency} -> ${data.targetCurrency}`;
            moneyManager.setMessage(true, successMessage);
            // moneyManager.updateUsersList(response.data);
        } else {
            const errorMessage = `Ошибка при конвертации: ${response.error}`;
            moneyManager.setMessage(false, response.error);
        }
    });
};


//Реализуйте перевод валюты:
moneyManager.sendMoneyCallback = function (data) {
    ApiConnector.transferMoney(data, (response) => {                //запрос на перевод валюты (transferMoney)
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            const successMessage = `Перевод выполнен: ${data.amount} ${data.currency} пользователю ${data.to}`;
            moneyManager.setMessage(true, successMessage);
            // moneyManager.updateUsersList(response.data);
        } else {
            const errorMessage = `Ошибка при переводе: ${response.error}`;
            moneyManager.setMessage(false, response.error);
        }
    });
};


//Работа с избранным
const favoritesWidget = new FavoritesWidget();              //Создайте объект типа FavoritesWidget

// Запросите начальный список избранного:
ApiConnector.getFavorites((response) => {
    if (response.success) {
        favoritesWidget.clearTable();                       // При успешном запросе очистите текущий список избранного
        favoritesWidget.fillTable(response.data);           // Отрисуйте полученные данные (fillTable)
        moneyManager.updateUsersList(response.data);     // Заполните выпадающий список для перевода денег
    }
});


//Реализуйте добавления пользователя в список избранных:
favoritesWidget.addUserCallback = function (data) {
    ApiConnector.addUserToFavorites(data, (response) => {
        if (response.success) {
            favoritesWidget.clearTable();                     // После успешного запроса очищаем текущий список избранного
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, `Пользователь успешно добавлен в избранное`);             // Выводим сообщ. об успехе или ошибке
        } else {
            favoritesWidget.setMessage(false, `Ошибка при добавлении пользователся в избранное : ${response.error}`);
        }
    });
};


// Реализуйте удаление пользователя из избранного
favoritesWidget.removeUserCallback = function (data) {
    ApiConnector.removeUserFromFavorites(data, (response) => {
        if (response.success) {
            favoritesWidget.clearTable();                         // После успешного запроса очищаем текущий список избранного
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(true, `Пользователь успешно удален из избранного`);        // Выводим сообщ. об успехе или ошибке
        } else {
            favoritesWidget.setMessage(false, `Ошибка при удалении пользователся в избранное : ${response.error}`);
        }
    });
};