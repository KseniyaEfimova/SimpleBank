'use strict';

import { mainURL, fetchAccount, errorMessage } from './module.js';

// Getting the authenticated user ID from sessionStorage

const loggedAccountId = JSON.parse(
  sessionStorage.getItem('authenticatedUserId')
);

// getting account data from server
async function getAccount() {
  let loggedtAccount;
  try {
    loggedtAccount = await fetchAccount(mainURL, loggedAccountId);
  } catch (err) {
    showAlert(`Ошибка получения данных: ${err}`);
  }
  return loggedtAccount;
}

const currentAccount = await getAccount();

// Selecting the necessary elements on the page

const labelWelcome = document.querySelector('.login');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.total__value--in');
const labelSumOut = document.querySelector('.total__value--out');
const labelSumInterest = document.querySelector('.total__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerTransactions = document.querySelector('.transactions');

const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');

const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const btnLogout = document.querySelector('.logout__btn');

// Options for currency formatting

const currencyOptions = {
  style: 'currency',
  currency: currentAccount.currency,
};

// If there is no authenticated user data, redirect to the main page
if (!currentAccount) {
  showAlert('Необходимо авторизоваться на главной странице сайта');
  window.location.href = '/mainPage.html';
} else {
  containerApp.style.opacity = 1;

  // User greeting

  labelWelcome.textContent = `Рады, что Вы снова с нами, ${
    currentAccount.userName.split(' ')[0]
  } !`;

  updateUi(currentAccount);
}

// Function to update the interface

function updateUi(account) {
  displayTransactions(account);
  displayBalance(account);
  displayTotal(account);
}

// Function for updating account data on the server

async function updateAccountData(accountId, updData) {
  let specifyingURL = `${mainURL}/${accountId}`;

  const response = await fetch(specifyingURL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updData),
  });

  return response.json();
}

// Display the current date on the page

labelDate.textContent = new Date().toLocaleString(currentAccount.locale, {
  dateStyle: 'full',
});

// Display transactions

function displayTransactions(account) {
  containerTransactions.innerHTML = '';
  let displayedTransactions = account.transactions;

  displayedTransactions.forEach(function ({ amount, date }, index) {
    const transactType = amount > 0 ? 'deposit' : 'withdrawal';

    const transDate = new Date(date).toLocaleString(currentAccount.locale, {
      dateStyle: 'short',
    });

    // Transaction markup

    const transactionRow = `
    <div class="transactions__row">
    <div class="transactions__type transactions__type--${transactType}">
    ${transactType}
       </div>
    <div class="transactions__date" data-date="${date}">${transDate}</div>
    <div class="transactions__value" data-amount="${amount.toFixed(
      2
    )}">${amount.toLocaleString(currentAccount.locale, currencyOptions)}</div>
    </div>
`;

    containerTransactions.insertAdjacentHTML('afterbegin', transactionRow);
    const newRow = containerTransactions.firstElementChild;
    if (index % 2 === 0) {
      newRow.style.backgroundColor = 'rgb(241, 246, 254)';
    }
  });
}

// Display current balance

function displayBalance(account) {
  const balance = account.transactions.reduce(
    (acc, { amount }) => acc + amount,
    0
  );

  labelBalance.textContent = balance.toLocaleString(currentAccount.locale, {
    style: 'currency',
    currency: currentAccount.currency,
  });
  account.balance = balance;
}

// Display summary block

function displayTotal(account) {
  const depositsTotal = account.transactions
    .filter(({ amount }) => amount > 0)
    .reduce((acc, { amount }) => acc + amount, 0);
  labelSumIn.textContent = depositsTotal.toLocaleString(
    currentAccount.locale,
    currencyOptions
  );
  const withdrawalsTotal = account.transactions
    .filter(({ amount }) => amount < 0)
    .reduce((acc, { amount }) => acc + amount, 0);

  labelSumOut.textContent = withdrawalsTotal.toLocaleString(
    currentAccount.locale,
    currencyOptions
  );

  const interestTotal = account.transactions
    .filter(({ amount, status }) => amount > 0 && status !== 'loan')
    .map(({ amount }) => (amount * account.interestRate) / 100)
    .reduce((acc, ints) => acc + ints, 0);

  labelSumInterest.textContent = interestTotal.toLocaleString(
    currentAccount.locale,
    currencyOptions
  );
}

// Transfers

btnTransfer.addEventListener('click', async function (e) {
  e.preventDefault();

  const lock = {};

  const transferAmount = +inputTransferAmount.value;
  const resipientName = inputTransferTo.value;

  // Checking the correctness of entering the transfer amount
  if (isNaN(transferAmount) || transferAmount <= 0) {
    showAlert(
      'Пожалуйста, введите корректную сумму перевода (положительное число)'
    );
    return;
  }

  inputTransferTo.value = '';
  inputTransferAmount.value = '';

  const getResipientAccount = await fetch(
    `${mainURL}?userName=${resipientName}`
  ).then(response => response.json());

  console.log(getResipientAccount);

  if (getResipientAccount.length === 0) {
    showAlert('Получатель не найден');
    return;
  }

  const resipientAccount = getResipientAccount[0];

  console.log(resipientAccount);

  if (
    transferAmount > 0 &&
    transferAmount <= currentAccount.balance &&
    resipientAccount &&
    currentAccount.userName !== resipientAccount.userName
  ) {
    lock[currentAccount.transactions] = true;
    currentAccount.transactions.push({
      amount: -transferAmount,
      date: new Date().toISOString(),
    });

    resipientAccount.transactions.push({
      amount: transferAmount,
      date: new Date().toISOString(),
    });

    // Updating the data

    await updateAccountData(loggedAccountId, {
      transactions: currentAccount.transactions,
    });
    lock[currentAccount.transactions] = false;

    await updateAccountData(resipientAccount.id, {
      transactions: resipientAccount.transactions,
    });

    updateUi(currentAccount);
  }
});

// Receiving a loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = +inputLoanAmount.value;
  inputLoanAmount.value = '';
  // Checking the correctness of entering the transfer amount
  if (isNaN(loanAmount) || loanAmount <= 0) {
    showAlert(
      'Пожалуйста, введите корректную сумму займа (положительное число)'
    );
    return;
  }

  const loanAmountValue = Math.ceil(loanAmount);

  currentAccount.transactions.push({
    amount: loanAmountValue,
    date: new Date().toISOString(),
    status: 'loan',
  });

  updateAccountData(loggedAccountId, {
    transactions: currentAccount.transactions,
  });
  setTimeout(() => {
    showAlert('Займ одобрен');
    updateUi(currentAccount);
  }, 2000);
});

const transactionsWrap = document.querySelector('.transactions-wrap');

let sortOrder = {
  date: true, // true - ascending, false - descending
  amount: false,
};

// Functionality for sorting transactions

function transactionsSorting(sortKey) {
  const rows = Array.from(document.querySelectorAll('.transactions__row'));
  const isAscending = sortOrder[sortKey];
  const sortedRows = rows.sort((a, b) => {
    const elemA =
      sortKey === 'date'
        ? new Date(a.querySelector('.transactions__date').dataset.date)
        : a.querySelector('.transactions__value').dataset.amount;
    const elemB =
      sortKey === 'date'
        ? new Date(b.querySelector('.transactions__date').dataset.date)
        : b.querySelector('.transactions__value').dataset.amount;

    return isAscending ? elemA - elemB : elemB - elemA;
  });

  // switch the sort order for the selected key

  sortOrder[sortKey] = !sortOrder[sortKey];

  containerTransactions.textContent = '';

  sortedRows.forEach((row, i) => {
    containerTransactions.appendChild(row);
    row.style.backgroundColor = '';
    if (i % 2 === 0) row.style.backgroundColor = 'rgb(241, 246, 254)';
  });
}

transactionsWrap.addEventListener('click', function (e) {
  const currentDropdown = e.target.closest('.dropdown');
  currentDropdown.classList.toggle('active');
  if (e.target.classList.contains('sort__dates')) {
    transactionsSorting('date');
  } else if (e.target.classList.contains('sort__amount')) {
    transactionsSorting('amount');
  }
});

// Functionality for closing an account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    async function deleteAccount(accountId) {
      try {
        const response = await fetch(`${mainURL}/${accountId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          showAlert('Текущий счёт закрыт, аккаунт удалён');
          window.location.href = '/mainPage.html';
          sessionStorage.removeItem('authenticatedUserId');
        } else {
          throw new Error(`Failed to delete account (${response.status})`);
        }
      } catch (err) {
        console.error('Error:', err);
        errorMessage(
          response.status,
          `Error: Ошибка удаления аккаунта <br> (${err})`
        );
      }
    }

    deleteAccount(loggedAccountId);
  }
});

// Function for logging out

function getLogOut() {
  window.location.href = '/mainPage.html';
  sessionStorage.removeItem('authenticatedUserId');
}

btnLogout.addEventListener('click', function (e) {
  e.preventDefault();
  getLogOut();
});

// Timer for automatic logout

function logOutTimer() {
  let timeOut = 420;

  const interval = setInterval(() => {
    const minutes = String(Math.trunc(timeOut / 60)).padStart(2, '0');
    const seconds = String(timeOut % 60).padStart(2, '0');
    labelTimer.textContent = `${minutes} : ${seconds}`;

    if (timeOut === 0) {
      clearInterval(interval);
      getLogOut();
    }
    timeOut--;
  }, 1000);
}

logOutTimer();

function showAlert(message) {
  const alertTemplate = document.getElementById('alert-dialog');
  const alertDialog = alertTemplate.content.cloneNode(true);
  const alertMessage = alertDialog.querySelector('.alert-dialog-message');
  alertMessage.textContent = message;
  const closeButton = alertDialog.querySelector('.alert-dialog-close');
  closeButton.addEventListener('click', () => {
    const currentalertDialog = document.querySelector('.alert-dialog');
    document.body.removeChild(currentalertDialog);
  });
  document.body.appendChild(alertDialog);
}
