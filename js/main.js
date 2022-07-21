// I am going to use order property in css to randomly locate the cards
// cards container
let cardContainer = document.querySelector(".game");
// Array of the cards
let cards = Array.from(cardContainer.children);
// array contain my ordering range (it's equel to my  cards array length)
let orderRange = shuffleArray([...Array(cards.length).keys()]);
let conunter = document.querySelector(".tries span");
let gamediff = document.querySelector(".game-mode ");
let soundchecker = document.querySelectorAll("input[type='checkbox']");
let elems = document.querySelectorAll("audio");

//  some vars
let rightHitsConter = 0;
let wrongHitsConter = 0;
let total = 0;
let rightHitsInARow = 0;
var time = 0;
let sound = false;

// start game
let startForm = document.querySelector("form");
startForm.addEventListener("submit", function (event) {
  event.preventDefault();
  //   player name
  let name = document.querySelector("form input").value.trim();
  document.querySelector(".name span").textContent = name;
  document.querySelector(".loser span").textContent = name;
  console.log(document.querySelector(".loser span"));

  // player name for winning
  document.querySelector(".play-again .winner-name span").textContent = name;
  document.querySelector(".first").classList.add("start");
  let dif = document.querySelector("form select").value;
  // setting game mode for winning
  gamediff.textContent = dif;
  if (!soundchecker[0].checked) {
    for (const el of elems) {
      el.muted = true;
      el.pause();
    }
  }

  gameMode(dif);
});

// play again after winning
let playAgain = document.querySelector(".winning");
let winningForm = document.querySelector(".play-again form");
winningForm.addEventListener("submit", function () {
  event.preventDefault();

  document.querySelector(".winning").classList.remove("show-winning");
  let dif = document.querySelector(".play-again form select").value;
  gamediff.textContent = dif;
  // setting game mode for winning
  gamediff = dif;
  if (!soundchecker[1].checked) {
    for (const el of elems) {
      el.muted = true;
      el.pause();
    }
  }
  reset();
  gameMode(dif);
  startGame();
});
//
// losing
let losing = document.querySelector(".losing");
let losingForm = document.querySelector(".losing form");
losingForm.addEventListener("submit", function () {
  event.preventDefault();

  document.querySelector(".losing").classList.remove("show-winning");
  let dif = document.querySelector(".losing form select").value;
  gamediff.textContent = dif;
  // setting game mode for winning
  gamediff = dif;
  if (!soundchecker[2].checked) {
    for (const el of elems) {
      el.muted = true;
      el.pause();
    }
  }
  cards.forEach((e) => {
    e.classList.remove("show");
  });
  cardContainer.style.pointerEvents = "";
  setTimeout(() => {
    reset();
    gameMode(dif);
    startGame();
  }, 200);
});
//
//
// adding order property randomly for my cards

cards.forEach((e, i) => {
  e.style.order = orderRange[i];
  e.addEventListener("click", function () {
    this.classList.add("show");
    // when two cards has been shown
    let showedCards = cards.filter((card) => {
      return card.classList.contains("show");
    });
    if (showedCards.length === 2) {
      if (showedCards[0].dataset.block === showedCards[1].dataset.block) {
        rightHit(showedCards);
      } else {
        wrongHit(showedCards);
      }
      cardContainer.style.pointerEvents = "none";
      setTimeout(() => {
        cardContainer.style.pointerEvents = "";
      }, 600);
    }
  });
});
// start game function
function startGame() {
  let arr = shuffleArray(orderRange);
  cards.forEach((e, i) => {
    e.style.cssText = "";
    e.style.order = arr[i];
  });
}
// function to randomly shufle an array
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
// easy mode
function easy() {
  cards.forEach((e) => {
    e.classList.add("show");
  });
  setTimeout(() => {
    cards.forEach((e) => {
      e.classList.remove("show");
    });
  }, 1500);
}
// game mode functcion
function gameMode(dif) {
  switch (dif) {
    case "easy":
      time = 120;
      easy();
      countDown(120, false);
      break;

    case "normal":
      time = 90;
      countDown(90, false);
      break;

    case "hard":
      time = 45;
      countDown(45, false);
      break;
    case "impossible":
      time = 30;
      countDown(30, true);
      break;
  }
}
// count down function
function countDown(time, imp) {
  let timer = document.querySelector(".timer");
  timer.style.display = "flex";
  let timerSpan = timer.children[1];
  timerSpan.innerHTML = time;
  let countDown = setInterval(() => {
    timerSpan.innerHTML -= 1;
    if (timerSpan.innerHTML == 10 && imp) {
      document.getElementById("imp-cd").play();
      imp = false;
    }
    if (timerSpan.innerHTML <= 0 || win) {
      clearInterval(countDown);
      if (!win) {
        gameOver();
      }
    }
  }, 1000);
}
// right hit function
function rightHit(c) {
  wrongHitsConter = 0;
  rightHitsConter++;
  total++;

  if (rightHitsConter > rightHitsInARow) {
    rightHitsInARow = rightHitsConter;
  }
  // to keep showing right hit cards
  c.forEach((e) => {
    e.style.cssText += "Transform:rotateY(180deg);pointer-events:none;";
    e.classList.remove("show");
  });
  // winning condition
  if (total === cards.length / 2) {
    winning();
  }
  // sounds effects
  document.getElementById("suc").play();
  if (rightHitsConter >= 2) {
    document.getElementById("suc2").play();
  }
}
// wrong Hit function
function wrongHit(c) {
  rightHitsConter = 0;
  wrongHitsConter++;
  setTimeout(() => {
    conunter.innerHTML = +conunter.innerHTML + 1;
    c.forEach((e) => {
      e.classList.remove("show");
    });
  }, 600);
  // sound efficts
  if (wrongHitsConter >= 3) {
    document.getElementById("fail").play();
  }
}
// game over
let win = false;
function gameOver() {
  cards.forEach((e) => {
    e.classList.add("show");
  });
  document.getElementById("losing").play();
  cardContainer.style.pointerEvents = "none";

  Swal.fire({
    position: "top-end",
    showConfirmButton: false,
    icon: "error",
    title: "Game is Over",
    text: "Sorry, But you have lost",
  });

  setTimeout(() => {
    losing.classList.add("show-winning");
  }, 2500);
}
// winning the game
function winning() {
  document.getElementById("win").play();
  cardContainer.style.pointerEvents = "none";
  win = true;
  Swal.fire({
    position: "top-end",
    showConfirmButton: false,
    icon: "success",
    title: "congratulations",
    text: "YOU DID IT!",
  });
  setTimeout(() => {
    document.querySelector(".winning").classList.add("show-winning");
    document.querySelector(".top-hit span").textContent = rightHitsInARow;
    document.querySelector(".time-req span").textContent =
      time - document.querySelector(".timer span").textContent;
    document.querySelector(".wrong-hits span").textContent =
      conunter.textContent;
    playAgain.classList.add("show-winning");
  }, 2500);
}

// reset function
function reset() {
  win = false;
  conunter.innerHTML = 0;
  rightHitsConter = 0;
  wrongHitsConter = 0;
  total = 0;
  rightHitsInARow = 0;
  time = 0;
}
