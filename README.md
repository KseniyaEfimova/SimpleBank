# Проект "Просто Банк"

Данный проект представляет собой веб-приложение, симулирующее работу простого банковского сервиса.<br>
**Цель проекта** - продемонстрировать навыки frontend-разработки и умение создавать интерактивные веб-приложения с использованием современных технологий.

## Проект состоит из двух основных частей:

1. **Главная страница (mainPage.html)**: <br>
   Это стартовая страница приложения, на которой представлена информация о банке, его услугах и преимуществах.<br> На этой странице пользователь может ознакомиться с основными возможностями банковского сервиса,<br> а также авторизоваться в системе, введя свои [учетные данные](https://jsonserver.online/user/XbV-mZh-taF/test-accounts) (логин и пин-код).

2. **Страница аккаунта (account.html)**: <br>
   После успешной авторизации пользователь перенаправляется на эту страницу, которая отображает информацию о его банковском счете.<br>
   <br>
   **На странице доступны следующие функции**:

   - Просмотр текущего баланса и истории транзакций
   - Возможность совершать переводы средств на другие счета
   - Возможность запросить кредит (займ)
   - Возможность закрыть свой счёт
   - Возможность сортировки отображения транзакций

Помимо основных страниц, проект также включает в себя JavaScript-файлы, отвечающие за логику работы приложения, обработку событий и взаимодействие с [online-сервером](https://jsonserver.online/).

## Технологии, использованные в проекте

В разработке данного проекта были использованы следующие технологии:

- **HTML5** и **CSS3** для создания структуры и стилизации веб-страниц
- **JavaScript (ES6+)** для реализации интерактивной логики приложения
- **Fetch API** для взаимодействия с сервером и получения данных
- **JSON Server** в качестве mock-сервера для хранения и обработки данных
- **Intersection Observer API** для реализации ленивой загрузки изображений и анимаций при прокрутке страницы
- **Модульный подход (ES6 modules)** для организации и разделения кода на модули

Помимо этого, в проекте применены различные техники и подходы, такие как:

- **Асинхронное программирование (async/await)** для обработки асинхронных операций
- **Обработка событий (Event Handling)** для реагирования на действия пользователя
- **Манипуляция DOM** для динамического изменения структуры веб-страницы
- **Валидация пользовательского ввода** для обеспечения корректности данных
- **Responsive Web Design** для обеспечения адаптивности интерфейса на различных устройствах

Проект демонстрирует навыки разработки современных веб-приложений, работы с JavaScript,<br>
DOM и асинхронным программированием, а также умение организовывать и структурировать код.
<br>

## Тестовые данные

> В случае отсутсвия информации по ссылке, для тестирования проекта необходимо запустить json-сервер на [jsonserver.online](https://jsonserver.online/) следуя инструкции ниже.

<br>

**Тестовые данные пользователей** : <br>
<br>

```
{
 "test-accounts": [
   {
     "userName": "Tom Colt",
     "accountNumber": 147741,
     "currency": "USD",
     "locale": "ru-RU",
     "interestRate": 1.4,
     "pin": 1111,
     "id": 1,
     "transactions": [
       {
         "amount": 300,
         "date": "2021-11-17T14:43:31.074Z"
       },
       {
         "amount": 270,
         "date": "2022-05-20T11:24:19.761Z"
       },
       {
         "amount": -300,
         "date": "2022-12-15T10:45:23.907Z"
       },
       {
         "amount": 3000,
         "date": "2023-04-26T12:17:46.255Z"
       },
       {
         "amount": -850,
         "date": "2023-06-12T15:14:06.486Z"
       },
       {
         "amount": -110,
         "date": "2024-01-14T15:21:20.814Z"
       },
       {
         "amount": 700,
         "date": "2024-02-11T16:31:32.484Z"
       }
     ]
   },
   {
     "userName": "Ann Fox",
     "accountNumber": 258852,
     "currency": "USD",
     "locale": "en-US",
     "interestRate": 0.8,
     "pin": 2222,
     "id": 2,
     "transactions": [
       {
         "amount": 600,
         "date": "2019-03-11T11:41:30.074Z"
       },
       {
         "amount": -200,
         "date": "2021-05-19T15:24:15.761Z"
       },
       {
         "amount": 280,
         "date": "2022-01-30T12:17:44.255Z"
       },
       {
         "amount": 300,
         "date": "2022-06-18T12:14:06.486Z"
       },
       {
         "amount": -200,
         "date": "2023-03-09T05:40:24.371Z"
       },
       {
         "amount": 150,
         "date": "2023-10-01T09:49:52.331Z"
       },
       {
         "amount": 1400,
         "date": "2024-02-01T10:24:07.834Z"
       }
     ]
   },
   {
     "userName": "Ben Rock",
     "accountNumber": 369963,
     "currency": "USD",
     "locale": "en-CA",
     "interestRate": 1,
     "pin": 3333,
     "id": 3,
     "transactions": [
       {
         "amount": 530,
         "date": "2023-01-21T11:17:46.255Z"
       },
       {
         "amount": 1300,
         "date": "2023-02-14T19:14:06.486Z"
       },
       {
         "amount": 500,
         "date": "2023-05-05T22:42:26.371Z"
       },
       {
         "amount": 40,
         "date": "2023-07-03T05:43:59.331Z"
       },
       {
         "amount": 190,
         "date": "2024-01-15T16:28:20.814Z"
       }
     ]
   }
 ]
}

```

### Инструкция по настройке online-сервера: <br>

<br>

1. На сайте https://jsonserver.online/home нажать в правом верхнем углу кнопку "DASHBOARD". <br>
2. На панеле навигации выбрать вкладку "SETUP SERVER". <br>
3. В открывшемся окне нажать в правом квадрате кнопку "Json DB".
4. В открывшемся окне вставить данные пользователей, указанные выше.
5. Нажмите кнопку "SAVE".
6. Заменить ссылку "mainURL" в js файле "module.js" на ту, что сгенерировалась в поле "url".
