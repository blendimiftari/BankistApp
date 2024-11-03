'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movements = acc.movements;
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};

createUsernames(accounts);

const calcDisplayPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€ `;

  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interest) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((mov, int) => mov + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);
  //Display balance
  calcDisplayPrintBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//lOGIN

let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();
  console.log('login');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  }
});

//Transfer

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = inputTransferAmount.value;
  console.log(amount);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    //Doing the transfer
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
});

//Loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Add movements
    currentAccount.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});

//Delete acc

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    inputCloseUsername.value = inputClosePin.value = '';

    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
});

//SORT

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// //SLICE
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());
// console.log([...arr]);

// //SPLICE
// console.log(arr.splice(2));
// arr.splice(-1);

// //REVERSE
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'j'];
// console.log(arr2.reverse());
// console.log(arr2);

// //CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// //JOIN
// console.log(letters.join(' - '));

// //AT METHOD
// const varg = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// //getting the last array element
// console.log(varg[varg.length - 1]);
// console.log(varg.slice(-1)[0]);
// console.log(arr.at(-1));

// //FOREACH per array
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log('------FOREACH-------');
// movements.forEach(function (mov, i, array) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
// });

//FOREACH per maps dhe sets

//MAP
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// //SET
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// });

/*Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each).For now, they are just interested in knowing whether a dog is an adult or a puppy.A dog is an adult if it is at least 3 years old, and its a puppy if its less than 3 years old

*/

//Check dogs function and remove cats from julia s array
// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCopy = dogsJulia.slice(1, -2);
//   console.log(dogsJulia);

//   console.log(dogsJuliaCopy.slice());

//   const bothDogsArr = [...dogsJuliaCopy, ...dogsKate];
//   console.log(bothDogsArr);

//   bothDogsArr.forEach(function (value, index) {
//     console.log(
//       `Dog number ${index + 1} ${
//         value >= 3
//           ? 'is an adult, and is ' + value + ' years old'
//           : 'is still a puppy'
//       } `
//     );
//   });
// };

// const test1 = [3, 5, 2, 12, 7];
// const test2 = [4, 1, 15, 8, 3];

// checkDogs(test1, test2);

//MAP
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;

// const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUSD);

// const movementsDescriptions = movements.map((mov, i, arr) => {
//   if (mov > 0) {
//     return `Movement ${i + 1}: You deposited ${mov}`;
//   } else {
//     return `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
//   }
// });

// console.log(movementsDescriptions);

//FILTER

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// const withdrawls = movements.filter(mov => mov < 0);
// console.log(withdrawls);

// //REDUCE
// //accumulator -> SNOWBALL
// const balance = movements.reduce(function (acc, curr, i, arr) {
//   return acc + curr;
// }, 0);
// console.log(balance);

//CHALLENGE 2

// const calcAverageHumanAge = function (ages) {
//   const dogToHuman = ages.map(value => {
//     if (value <= 2) {
//       return value * 2;
//     } else {
//       return 16 + value * 4;
//     }
//   });

//   console.log(dogToHuman);

//   const lessThan18 = dogToHuman.filter(val => val >= 18);
//   console.log(lessThan18);

//   const sum = lessThan18.reduce((acc, curr) => {
//     return acc + curr;
//   }, 0);

//   return sum / lessThan18.length;
// };

// const test1 = [5, 2, 4, 1, 15, 8, 3];
// const test2 = [16, 6, 10, 5, 6, 1, 4];

// console.log(calcAverageHumanAge(test2));

//PIPELINE
// const eurToUsd = 1.1;
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

//CHALLENGE 3
// const calcAverageHumanAge = ages =>
//   ages
//     .map(value => (value <= 2 ? value * 2 : 16 + value * 4))
//     .filter(val => val >= 18)
//     .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);
// const test1 = [5, 2, 4, 1, 15, 8, 3];
// const test2 = [16, 6, 10, 5, 6, 1, 4];

// console.log(calcAverageHumanAge(test2));

//FIND
// const firstWithdrawl = movements.find(mov => mov < 0);
// console.log(firstWithdrawl);

// const account = accounts.find(acc => acc.owner === 'Jessica Daivs');
// console.log(account);

// for (const [i, account] of accounts.entries()) {
//   if (account.owner === 'Jessica Davis') {
//     console.log(account);
//   }
// }

//Array methods practice
//1.
// const bankDepositSum = accounts
//   .flattMap(acc => acc.movements)
//   .filter(mov => mov > 0)
//   .reduce(sum, cur => sum + cur, 0);
// console.log(bankDepositSum);

// //2.
// const numDeposit = accounts
//   .flatMap(acc => acc.movements)
//   .filter(acc => acc >= 1000).length;

//CHALLENGE 4:

//being within a range 10% above and below the recommended portion means: current > (recommended *0.90) && current < (recommended * 1.10). the current portion should be between 90% and 110% of the recommended portion

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(function (dog) {
  const recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
  dog.recommendedFood = recommendedFood;
});

const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(dogSarah);

//

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMapmap(dog => dog.owners);

console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMapmap(dog => dog.owners);

console.log(ownersEatTooMuch);
