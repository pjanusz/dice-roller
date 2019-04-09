(function () {
  var diceButtons = document.getElementById('rand-dices'),
    selectedDices = document.getElementById('rand-selected'),
    rollButton = document.getElementById('rand-roll-button'),
    showHistory = document.getElementById('rand-show-history'),
    clearAll = document.getElementById('rand-clear-all'),
    clearSelButton = document.getElementById('rand-clear-sel'),
    coinContainer = document.getElementById('rand-coin-container'),
    total = document.getElementById('rand-total'),
    history = document.getElementById('rand-history'),
    rollsHistory = document.getElementById('rand-rolls-history'),
    closeHistory = document.getElementById('rand-close-history'),
    text = {
      choose: 'Choose your destiny...', //0
      death: 'Death or glory...', //1
      limit: 'You must construct additional Pylons', //2
      hcleared: 'History cleared...', //3
      dcleared: 'Destiny cleared...', //4
      coin: 'Heads or tails', //5
      locked: 'Locked...', //6
      what: 'For what?'
    },
    selected = null;

  diceButtons.addEventListener('click', addDice);
  selectedDices.addEventListener('click', removeDice);
  clearSelButton.addEventListener('click', clearSelected);
  rollButton.addEventListener('click', roll);
  clearAll.addEventListener('click', function () {
    if (selected == null && rollsHistory.innerHTML == '') return;
    else if (selected != null) {
      clearSelected();
    }
    rollsHistory.innerHTML = '';
    toggleLowerButtons();
  });
  showHistory.addEventListener('click', function () {
    history.classList.remove('rand-history-hidden');
  });
  closeHistory.addEventListener('click', function () {
    history.classList.add('rand-history-hidden');
  });

  function addDice(click) {
    var padlock = document.createElement('BUTTON');
    padlock.className = 'rand-padlock';
    padlock.addEventListener('click', lockDice);
    var toRollContainer = document.createElement('DIV');
    toRollContainer.className = 'rand-toroll-container rand-padlock-open';
    if (click.target.value) {
      selectedDices.childNodes[0].nodeValue = '';
      var temp = click.target,
        toBlock,
        clone;
      if (temp.value == 1) {
        toBlock = document.getElementsByClassName('rand-dice');
        selected = 1;
        total.innerText = text.coin;
        selectedDices.classList.add('rand-coinBckgrd');
        for (var i = 0; i < toBlock.length; i++) {
          toBlock[i].classList.add('rand-dice-blocked');
          toBlock[i].disabled = true;
        }
        toggleUpperButtons();
      } else {
        if (selected === null) selected = [];
        toBlock = document.getElementById('rand-coin');
        toBlock.classList.add('rand-dice-blocked');
        toBlock.disabled = true;
        clone = temp.cloneNode(true);
        clone.innerText = '';
        clone.className += ' rand-toRoll';
        clone.id = temp.id + '-clone';
        if (selected.length < 12) {
          toRollContainer.appendChild(clone);
          toRollContainer.appendChild(padlock);
          selectedDices.appendChild(toRollContainer);
          selected.push(clone);
        } else if (selected.length == 12) {
          total.innerText = text.limit;
        }
        if (
          selected.length > 0 &&
          rollButton.classList.contains('rand-inactive-button')
        )
          toggleUpperButtons();
      }
    }
  }

  function lockDice(event) {
    if (
      event.target.classList.contains('rand-padlock') &&
      event.target.previousSibling.innerText != ''
    ) {
      event.target.classList.toggle('rand-padlock-closed');
      event.target.previousSibling.classList.toggle('rand-toRoll');
      event.target.previousSibling.classList.toggle('rand-locked');
    } else {
      setTimeout(() => {
        total.innerText = text.death;
        toggleUpperButtons();
      }, 1000);
      total.innerText = text.what;
      toggleUpperButtons();
    }
  }

  function removeDice(click) {
    if (click.target.value) {
      var toRemove = selected.indexOf(click.target);
      selected.splice(toRemove, 1);
      selectedDices.removeChild(click.target.parentElement);
      if (selected.length === 0) clearSelected();
    }
  }

  function toggleUpperButtons() {
    rollButton.classList.toggle('rand-inactive-button');
    clearSelButton.classList.toggle('rand-inactive-button');
    if (rollButton.disabled == true) {
      rollButton.disabled = false;
      clearSelButton.disabled = false;
    } else {
      rollButton.disabled = true;
      clearSelButton.disabled = true;
    }
  }

  function toggleLowerButtons() {
    if (clearAll.disabled == true) {
      showHistory.disabled = false;
      clearAll.disabled = false;
    } else {
      showHistory.disabled = true;
      clearAll.disabled = true;
    }
    showHistory.classList.toggle('rand-inactive-button');
    clearAll.classList.toggle('rand-inactive-button');
  }

  function clearSelected() {
    if (selected == 1) rollsHistory.innerHTML += '<hr>';
    var blocked = document.getElementsByClassName('rand-dice');
    var toRemove = document.querySelectorAll('.rand-toroll-container');
    for (var dice of blocked) {
      dice.classList.remove('rand-dice-blocked');
      dice.disabled = false;
    }
    for (var toDel of toRemove) {
      toDel.remove();
    }
    selected = null;
    selectedDices.childNodes[0].nodeValue = text.choose;
    total.innerText = text.death;
    selectedDices.className = 'rand-dices rand-selected';
    if (!coinContainer.classList.contains('rand-coin-container-hidden')) {
      coinContainer.classList.add('rand-coin-container-hidden');
    }
    toggleUpperButtons();
  }

  function roll() {
    var sum = 0;
    var time = new Date().toLocaleTimeString();
    if (selected == 1) {
      total.innerText = '';
      selectedDices.classList.remove('rand-coinBckgrd');
      selectedDices.className = 'rand-dices rand-selected';
      coinContainer.className = 'rand-coin-container';
      sum = Math.random() < 0.5 ? 0 : 1;
      toggleUpperButtons();
      setTimeout(() => {
        coinContainer.classList.add('rand-coin-container-hidden');
        if (sum == 1)
          selectedDices.classList.add('rand-coin-flip-heads');
        else selectedDices.classList.add('rand-coin-flip-tails');
        total.innerText = sum == 0 ? 'Tails!' : 'Heads!';
        rollsHistory.innerHTML += `<p class='rand-history-text rand-history-total'><span>${time}</span><span>${
                  total.innerText
              }</span></p>`;
        toggleUpperButtons();
        if (clearAll.disabled == true) toggleLowerButtons();
      }, 2000);
    } else {
      var dicesToRoll = document.getElementsByClassName('rand-toRoll');
      var lockedDices = document.getElementsByClassName('rand-locked');
      if (dicesToRoll === 0 && lockedDices !== 0) {
        total.innerText = text.locked;
      } else {
        var roll;
        for (var dice of dicesToRoll) {
          var diceId = dice.id.match(new RegExp(/(?<=-).*(?=-)/));
          roll = Math.floor(Math.random() * dice.value + 1);
          dice.innerText = roll;
          sum += roll;
          rollsHistory.innerHTML += `<p class='rand-history-text'>${diceId} = ${roll}</p>`;
        }
        for (var locked of lockedDices) {
          var lockedId = dice.id.match(new RegExp(/(?<=-).*(?=-)/));
          sum += Number(locked.innerText);
          rollsHistory.innerHTML += `<p class='rand-history-text' style='color: red;'>LOCKED ${lockedId} = ${locked.innerText}</p>`;
        }
        total.innerText = sum;
        rollsHistory.innerHTML += `<p class='rand-history-text rand-history-total'><span>${time}</span> <span>Total = ${sum}</span></p><hr>`;
        if (clearAll.disabled == true) toggleLowerButtons();
      }
    }
  }
})();