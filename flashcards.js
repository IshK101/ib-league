lucide.createIcons();


const flashcards = [
    {
        id: 1,
        question: "What is Newton's First Law?",
        answer: "An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by an external force.",
        subject: "Physics"
    },
    {
        id: 2,
        question: "What is a exponential function",
        answer: "An exponential function is a function where the variable is the exponent of a constant base.",
        subject: "Mathematics"
    },
    {
        id: 3,
        question: "What is the quadratic formula?",
        answer: "For ax² + bx + c = 0, x = [-b ± √(b² - 4ac)] / 2a",
        subject: "Mathematics"
    },
    {
        id: 4,
        question: "What is the difference between ionic and covalent bonds?",
        answer: "Ionic bonds involve the transfer of electrons between atoms, while covalent bonds involve the sharing of electrons between atoms.",
        subject: "Chemistry"
    },
    {
        id: 5,
        question: "What is an electon?",
        answer: "An electron is a subatomic particle that carries a negative electric charge.",
        subject: "Chemistry"
    }
];


let currentCardIndex = 0;
let points = 0;
let selectedSubject = 'all';
let assessedCards = new Set();
let filteredCards = [...flashcards];

const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const toggleSidebarBtn = document.getElementById('toggleSidebar');
const subjectButtons = document.querySelectorAll('.subject-button');
const flashcardElement = document.querySelector('.flashcard');
const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const currentSubjectElement = document.getElementById('currentSubject');
const prevButton = document.getElementById('prevCard');
const nextButton = document.getElementById('nextCard');
const correctButton = document.getElementById('correctBtn');
const incorrectButton = document.getElementById('incorrectBtn');
const pointsText = document.getElementById('pointsText');
const progressFill = document.getElementById('progressFill');
const cardsProgressFill = document.getElementById('cardsProgressFill');
const cardCount = document.getElementById('cardCount');
const createCardBtn = document.getElementById('createCardBtn');
const createCardModal = document.getElementById('createCardModal');
const createCardForm = document.getElementById('createCardForm');
const cancelCreateBtn = document.getElementById('cancelCreate');

function toggleSidebar() {
    console.log('toggleSidebar called');
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('collapsed');
    const icon = toggleSidebarBtn.querySelector('i');
    if (icon) {
        icon.setAttribute('data-lucide',
            sidebar.classList.contains('collapsed') ? 'panel-left' : 'panel-left-close'
        );
        lucide.createIcons();
    }
}

function updateCard() {
    console.log('updateCard called', { currentCardIndex, filteredCards });
    const card = filteredCards[currentCardIndex];
    questionElement.textContent = card.question;
    answerElement.textContent = card.answer;
    currentSubjectElement.textContent = card.subject;
    

    prevButton.disabled = currentCardIndex === 0;
    nextButton.disabled = currentCardIndex === filteredCards.length - 1;
    
  
    const isAssessed = assessedCards.has(card.id);
    correctButton.disabled = isAssessed;
    incorrectButton.disabled = isAssessed;
    

    cardsProgressFill.style.height = `${((currentCardIndex + 1) / filteredCards.length) * 100}%`;
    cardCount.textContent = `${currentCardIndex + 1}/${filteredCards.length}`;
    

    flashcardElement.classList.remove('flipped');
}

function filterCards(subject) {
    console.log('filterCards called', { subject });
    selectedSubject = subject;
    filteredCards = subject === 'all' 
        ? [...flashcards]
        : flashcards.filter(card => card.subject === subject);
    currentCardIndex = 0;
    updateCard();
}

function showToast(message, type) {
    console.log('showToast called', { message, type });
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

function updatePoints() {
    console.log('updatePoints called', { points });
    const maxPoints = flashcards.length * 10;
    const progress = (points / maxPoints) * 100;
    pointsText.textContent = `Points: ${points}`;
    progressFill.style.width = `${progress}%`;
}


toggleSidebarBtn.addEventListener('click', toggleSidebar);

subjectButtons.forEach(button => {
    button.addEventListener('click', () => {
        subjectButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        filterCards(button.dataset.subject);
    });
});

flashcardElement.addEventListener('click', () => {
    flashcardElement.classList.toggle('flipped');
});

prevButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentCardIndex > 0) {
        currentCardIndex--;
        updateCard();
    }
});

nextButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentCardIndex < filteredCards.length - 1) {
        currentCardIndex++;
        updateCard();
    }
});

function handleAssessment(correct) {
    console.log('handleAssessment called', { correct });
    const currentCard = filteredCards[currentCardIndex];
    if (!assessedCards.has(currentCard.id)) {
        if (correct) {
            points += 10;
            updatePoints();
            showToast('Correct! Well done!', 'correct');
        } else {
            showToast('Incorrect. Keep practicing!', 'incorrect');
        }
        assessedCards.add(currentCard.id);
        updateCard();
        
    
        if (currentCardIndex < filteredCards.length - 1) {
            setTimeout(() => {
                currentCardIndex++;
                updateCard();
            }, 1500);
        }
    }
}

correctButton.addEventListener('click', (e) => {
    e.stopPropagation();
    handleAssessment(true);
});

incorrectButton.addEventListener('click', (e) => {
    e.stopPropagation();
    handleAssessment(false);
});

function navigateTo(path) {
    console.log('navigateTo called', { path });
    window.location.href = path;
}


createCardBtn.addEventListener('click', () => {
    createCardModal.style.display = 'block';
});

cancelCreateBtn.addEventListener('click', () => {
    createCardModal.style.display = 'none';
    createCardForm.reset();
});


window.addEventListener('click', (e) => {
    if (e.target === createCardModal) {
        createCardModal.style.display = 'none';
        createCardForm.reset();
    }
});

createCardForm.addEventListener('submit', (e) => {
    console.log('createCardForm submit handler called');
    e.preventDefault();
    
    const newCard = {
        id: flashcards.length + 1,
        subject: document.getElementById('cardSubject').value,
        question: document.getElementById('cardQuestion').value,
        answer: document.getElementById('cardAnswer').value
    };

    flashcards.push(newCard);


    createCardForm.reset();
    createCardModal.style.display = 'none';


    showToast('Flashcard created successfully!', 'correct');


    if (selectedSubject === 'all' || selectedSubject === newCard.subject) {
        filterCards(selectedSubject);
    }
});

updateCard();
updatePoints();
