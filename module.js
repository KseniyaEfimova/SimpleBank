'use strict';

const mainURL = `https://jsonserver.online/user/XbV-mZh-taF/test-accounts`;

async function fetchAccount(url, accountId) {
  let response;
  try {
    response = await fetch(`${url}/${accountId || ''}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch accounts data (${response.status})`);
    }

    const data = await response.json();

    return data;
  } catch (err) {
    console.error(err);

    errorMessage(
      response.status,
      `Error: Ошибка получения данных с сервера <br> (${err})`
    );
  }
}

//_________________________________

function errorMessage(status, err) {
  const errorDiv = `

  <div class="modal-window active error__window "> 
    <div class="error__message">
      <h2 class="error__header" data-text="${status}"> ${status} </h2>
      <h4 class="error__subtitler" data-text="Opps! ${err}">
        Opps! ${err}
      </h4>
      <p class="error__text">
        Извините! Страница, которую Вы ищете, не может быть найдена. <br>
        Sorry, the page you're looking for doesn't exist. 
      </p>
      <div class="error__btn">
               <a href="javascript:window.location.reload();">Главная страница</a>
            </div>
    </div>
  </div>
`;

  document.body.insertAdjacentHTML('beforeend', errorDiv);
}

export { mainURL, fetchAccount, errorMessage };
