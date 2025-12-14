const displayType = document.getElementById('displayType');
const answerMode = document.getElementById('answerMode');
const analogClock = document.getElementById('analogClock');
const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const digitalClock = document.getElementById('digitalClock');
const optionsContainer = document.getElementById('options');
const feedback = document.getElementById('feedback');
const nextButton = document.getElementById('nextButton');

const minutesSteps = [0, 15, 30, 45];
const baseHours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const fullHourNames = {
    1: 'jedna hodina',
    2: 'dvě hodiny',
    3: 'tři hodiny',
    4: 'čtyři hodiny',
    5: 'pět hodin',
    6: 'šest hodin',
    7: 'sedm hodin',
    8: 'osm hodin',
    9: 'devět hodin',
    10: 'deset hodin',
    11: 'jedenáct hodin',
    12: 'dvanáct hodin'
};

const nextHourAccusative = {
    1: 'jednu',
    2: 'dvě',
    3: 'tři',
    4: 'čtyři',
    5: 'pět',
    6: 'šest',
    7: 'sedm',
    8: 'osm',
    9: 'devět',
    10: 'deset',
    11: 'jedenáct',
    12: 'dvanáct'
};

const nextHourGenitive = {
    1: 'jedné',
    2: 'druhé',
    3: 'třetí',
    4: 'čtvrté',
    5: 'páté',
    6: 'šesté',
    7: 'sedmé',
    8: 'osmé',
    9: 'deváté',
    10: 'desáté',
    11: 'jedenácté',
    12: 'dvanácté'
};

let currentQuestion = null;

function formatDigital(hour, minute) {
    const paddedHour = hour.toString().padStart(2, '0');
    const paddedMinute = minute.toString().padStart(2, '0');
    return `${paddedHour}:${paddedMinute}`;
}

function timeToPhrase(hour, minute) {
    const nextHour = hour === 12 ? 1 : hour + 1;

    switch (minute) {
        case 0:
            return fullHourNames[hour];
        case 15:
            return `čtvrť na ${nextHourAccusative[nextHour]}`;
        case 30:
            return `půl ${nextHourGenitive[nextHour]}`;
        case 45:
            return `tři čtvrtě na ${nextHourAccusative[nextHour]}`;
        default:
            return '';
    }
}

function rotateHands(hour, minute) {
    const minuteAngle = minute * 6;
    const hourAngle = (hour % 12) * 30 + minute * 0.5;

    minuteHand.style.transform = `translate(-50%, 0) rotate(${minuteAngle}deg)`;
    hourHand.style.transform = `translate(-50%, 0) rotate(${hourAngle}deg)`;
}

function toggleClocks(showAnalog) {
    analogClock.style.display = showAnalog ? 'flex' : 'none';
    digitalClock.style.display = showAnalog ? 'none' : 'grid';
}

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function generateOptions(correctTime, answersAsWords) {
    const options = new Set();
    const correctLabel = answersAsWords
        ? timeToPhrase(correctTime.hour, correctTime.minute)
        : formatDigital(correctTime.hour, correctTime.minute);
    options.add(correctLabel);

    while (options.size < 4) {
        const hour = baseHours[Math.floor(Math.random() * baseHours.length)];
        const minute = minutesSteps[Math.floor(Math.random() * minutesSteps.length)];
        const label = answersAsWords ? timeToPhrase(hour, minute) : formatDigital(hour, minute);

        if (label !== correctLabel) {
            options.add(label);
        }
    }

    return shuffle([...options]);
}

function renderOptions(list, correctLabel) {
    optionsContainer.innerHTML = '';
    list.forEach((optionText, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.type = 'button';
        button.textContent = `${String.fromCharCode(65 + index)}) ${optionText}`;
        button.addEventListener('click', () => handleAnswer(optionText, button, correctLabel));
        optionsContainer.appendChild(button);
    });
}

function handleAnswer(selected, button, correctLabel) {
    const buttons = optionsContainer.querySelectorAll('.option');
    buttons.forEach((btn) => {
        btn.disabled = true;
    });

    if (selected === correctLabel) {
        button.classList.add('correct');
        feedback.textContent = 'Správně!';
    } else {
        button.classList.add('incorrect');
        feedback.textContent = 'Zkus to znovu příště. Správná odpověď je zvýrazněná.';
        buttons.forEach((btn) => {
            if (btn.textContent.endsWith(correctLabel)) {
                btn.classList.add('correct');
            }
        });
    }
}

function newQuestion() {
    const hour = baseHours[Math.floor(Math.random() * baseHours.length)];
    const minute = minutesSteps[Math.floor(Math.random() * minutesSteps.length)];
    const useAnalog = Math.random() > 0.5;
    const answersAsWords = Math.random() > 0.5;
    const correctLabel = answersAsWords ? timeToPhrase(hour, minute) : formatDigital(hour, minute);
    const options = generateOptions({ hour, minute }, answersAsWords);

    currentQuestion = { hour, minute, useAnalog, answersAsWords, correctLabel };

    feedback.textContent = '';
    toggleClocks(useAnalog);
    displayType.textContent = useAnalog ? 'Ručičkové hodiny' : 'Digitální hodiny';
    answerMode.textContent = answersAsWords ? 'Odpovědi: slovně' : 'Odpovědi: číslem';

    if (useAnalog) {
        rotateHands(hour, minute);
    } else {
        digitalClock.textContent = formatDigital(hour, minute);
    }

    renderOptions(options, correctLabel);
}

nextButton.addEventListener('click', newQuestion);
newQuestion();
