const logoutButton = new LogoutButton();

//В свойство action запишите функцию, которая будет вызывать запрос деавторизации (logout)
logoutButton.action = function () {
    ApiConnector.logout((response) => {
        if (response.success) {
            console.log('Logout successful');
            location.reload();
        } else {
            console.error('Error during logout:', response.error);
        }
    });
};

//Выполните запрос на получение текущего пользователя 
ApiConnector.current((response) => {
    if (response.success) {
        console.log('Current user:', response.data);
        ProfileWidget.showProfile(response.data);     //если ответ успешный, то вызовите метод отображения данных профиля (ProfileWidget.showProfile) в который передавайте данные ответа от сервера.
    } else {
        console.error('Error getting current user:', response.error);
    }


//Создайте объект типа RatesBoard
const ratesBoard = new RatesBoard();

//Напишите функцию, которая будет выполнять запрос получения курсов валют.
function updateExchangeRates() {
    ApiConnector.getStocks((response) => {
        if (response.success) {
            console.log('Exchange rates:', response.data);
            ratesBoard.clearTable();                       // в случае успешного запроса, очищайте таблицу с данными (clearTable) и заполняйте её (fillTable) полученными данными
            ratesBoard.fillTable(response.data);
        } else {
            console.error('Error getting exchange rates:', response.error);
        }
    });
}

updateExchangeRates();

setInterval(updateExchangeRates, 60000);

});