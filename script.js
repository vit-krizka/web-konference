const minuteMarks = [0, 15, 30, 45];
const hourWords = {
    1: 'jedna',
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

const elements = {
    clockFrame: document.querySelector('.clock-frame'),
    hourHand: document.querySelector('.hour-hand'),
    minuteHand: document.querySelector('.minute-hand'),
    digital: document.querySelector('.digital'),
    options: Array.from(document.querySelectorAll('.option')),
    feedback: document.querySelector('.feedback'),
    tags: {
        typ: document.querySelector('[data-label="typ"]'),
        zapis: document.querySelector('[data-label="zapis"]')
    },
    score: {
        correct: document.querySelector('[data-score="correct"]'),
        total: document.querySelector('[data-score="total"]')
    },
    reveal: document.getElementById('reveal'),
    next: document.getElementById('next-question')
};

const state = {
    current: null,
    answered: false,
    correct: 0,
    total: 0
};

function pad(value) {
    return String(value).padStart(2, '0');
}

function formatDigital(hour, minute) {
    return `${pad(hour)}:${pad(minute)}`;
}

function hourLabel(hour) {
    if (hour === 1) return `${hourWords[hour]} hodina`;
    if ([2, 3, 4].includes(hour)) return `${hourWords[hour]} hodiny`;
    return `${hourWords[hour]} hodin`;
}

function formatText(hour, minute) {
    const nextHour = hour === 12 ? 1 : hour + 1;
    switch (minute) {
        case 0:
            return hourLabel(hour);
        case 15:
            return `čtvrť na ${hourWords[nextHour]}`;
        case 30:
            return `půl ${hourWords[nextHour]}`;
        case 45:
            return `tři čtvrtě na ${hourWords[nextHour]}`;
        default:
            return `${hourLabel(hour)} (${formatDigital(hour, minute)})`;
    }
}

function randomTime() {
    const hour = Math.floor(Math.random() * 12) + 1;
    const minute = minuteMarks[Math.floor(Math.random() * minuteMarks.length)];
    return { hour, minute };
}

function shuffle(list) {
    const array = [...list];
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function buildOptions(correct, formatType) {
    const formatter = formatType === 'text' ? formatText : ({ hour, minute }) => formatDigital(hour, minute);
    const options = [formatter(correct)];

    while (options.length < 4) {
        const candidate = formatter(randomTime());
        if (!options.includes(candidate)) {
            options.push(candidate);
        }
    }

    return shuffle(options);
}

function updateHands(hour, minute) {
    const minuteAngle = minute * 6;
    const hourAngle = (hour % 12) * 30 + minute * 0.5;
    elements.minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
    elements.hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
}

function setMode(mode) {
    elements.clockFrame.dataset.mode = mode;
}

function setTags(mode, formatType) {
    elements.tags.typ.textContent = mode === 'analog' ? 'Ručičkové' : 'Digitální';
    elements.tags.zapis.textContent = formatType === 'text' ? 'Možnosti: slovy' : 'Možnosti: čísly';
}

function highlightSolution() {
    if (!state.current) return;
    elements.options.forEach((btn) => {
        btn.classList.toggle('correct', btn.dataset.choice === state.current.correctLetter);
    });
    elements.feedback.textContent = `Správně: ${state.current.correctLabel} · ${state.current.alternativeLabel}`;
    elements.feedback.className = 'feedback success';
}

function setQuestion() {
    state.answered = false;
    elements.feedback.textContent = '';
    elements.feedback.className = 'feedback';
    elements.options.forEach((btn) => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
    });

    const displayMode = Math.random() < 0.5 ? 'analog' : 'digital';
    const optionFormat = Math.random() < 0.5 ? 'text' : 'digital';
    const time = randomTime();
    const correctLabel = optionFormat === 'text' ? formatText(time.hour, time.minute) : formatDigital(time.hour, time.minute);
    const alternativeLabel = optionFormat === 'text' ? formatDigital(time.hour, time.minute) : formatText(time.hour, time.minute);

    const optionValues = buildOptions(time, optionFormat);
    const correctIndex = optionValues.indexOf(correctLabel);
    const letters = ['A', 'B', 'C', 'D'];

    elements.options.forEach((btn, index) => {
        btn.textContent = `${letters[index]}) ${optionValues[index]}`;
        btn.dataset.value = optionValues[index];
    });

    state.current = {
        time,
        correctLabel,
        alternativeLabel,
        correctLetter: letters[correctIndex],
        displayMode,
        optionFormat
    };

    setMode(displayMode);
    setTags(displayMode, optionFormat);
    updateHands(time.hour, time.minute);
    elements.digital.textContent = formatDigital(time.hour, time.minute);
}

function updateScore() {
    elements.score.correct.textContent = state.correct;
    elements.score.total.textContent = state.total;
}

function handleAnswer(choice) {
    if (state.answered || !state.current) return;
    state.answered = true;
    state.total += 1;

    const isCorrect = choice === state.current.correctLetter;
    if (isCorrect) {
        state.correct += 1;
    }

    elements.options.forEach((btn) => {
        const letter = btn.dataset.choice;
        btn.disabled = true;
        if (letter === state.current.correctLetter) {
            btn.classList.add('correct');
        }
        if (letter === choice && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    elements.feedback.textContent = isCorrect
        ? `Správně! ${state.current.alternativeLabel}`
        : `Ještě jednou: ${state.current.alternativeLabel}`;
    elements.feedback.className = isCorrect ? 'feedback success' : 'feedback error';
    updateScore();
}

elements.options.forEach((btn) => {
    btn.addEventListener('click', () => handleAnswer(btn.dataset.choice));
});

elements.next.addEventListener('click', setQuestion);
elements.reveal.addEventListener('click', highlightSolution);

setQuestion();
