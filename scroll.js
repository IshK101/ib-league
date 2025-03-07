const questionDB = {
    mathematics: [
      {
        id: 1,
        question: "Solve the quadratic equation: x² + 5x + 6 = 0",
        solution: "Using the quadratic formula or factoring:\nx² + 5x + 6 = (x + 2)(x + 3) = 0\nTherefore, x = -2 or x = -3"
      },
      {
        id: 2,
        question: "What is the derivative of f(x) = x³ + 2x² - 4x + 1?",
        solution: "Using the power rule:\nf'(x) = 3x² + 4x - 4"
      },
      {
        id: 3,
        question: "Find the area of a circle with radius 5 units.",
        solution: "Area = πr²\nArea = π(5)²\nArea = 78.54 square units"
      }
    ],
    physics: [
      {
        id: 1,
        question: "Calculate the force needed to accelerate a 2kg mass at 3 m/s².",
        solution: "Using F = ma:\nF = 2kg × 3m/s²\nF = 6 Newtons"
      },
      {
        id: 2,
        question: "What is the period of a pendulum with length 1 meter on Earth?",
        solution: "Using T = 2π√(L/g):\nT = 2π√(1/9.81)\nT ≈ 2.01 seconds"
      },
      {
        id: 3,
        question: "Calculate the wavelength of a wave with frequency 500Hz and speed 340m/s.",
        solution: "Using v = fλ:\n340 = 500λ\nλ = 0.68 meters"
      }
    ],
    chemistry: [
      {
        id: 1,
        question: "Balance this equation: H₂ + O₂ → H₂O",
        solution: "2H₂ + O₂ → 2H₂O"
      },
      {
        id: 2,
        question: "Calculate the molar mass of H₂SO₄.",
        solution: "H₂SO₄ = (2 × 1) + (32) + (4 × 16)\n= 2 + 32 + 64\n= 98 g/mol"
      },
      {
        id: 3,
        question: "What is the pH of a 0.01M HCl solution?",
        solution: "pH = -log[H⁺]\npH = -log(0.01)\npH = 2"
      }
    ]
  };
  

  let currentSubject = 'mathematics';
  let points = 0;
  let loadedQuestions = new Set();
  

  const questionsFeed = document.getElementById('questionsFeed');
  const pointsDisplay = document.getElementById('pointsDisplay');
  const currentSubjectDisplay = document.getElementById('currentSubject');
  const subjectButtons = document.querySelectorAll('.subject-btn');
  

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.className = 'toast';
  document.body.appendChild(toast);
  console.log('Toast element created:', toast);
  

  const style = document.createElement('style');
  style.textContent = `
    .toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #333;
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      z-index: 1000;
    }

    .toast.visible {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
  

  function init() {
    console.log('Initializing application...');
    loadQuestions(currentSubject);
    updatePoints();
    setupInfiniteScroll();
    console.log('Initialization complete');
  }
  

  function loadQuestions(subject) {
    console.log('Loading questions for subject:', subject);
    const questions = questionDB[subject];
    questions.forEach(question => {
      if (!loadedQuestions.has(question.id)) {
        createQuestionCard(question);
        loadedQuestions.add(question.id);
      }
    });
    console.log('Questions loaded. Total loaded questions:', loadedQuestions.size);
  }
  

  function createQuestionCard(question) {
    console.log('Creating card for question:', question.id);
    const card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML = `
      <div class="question-content">${question.question}</div>
      <button class="view-solution-btn">View Solution</button>
      <div class="solution-container">
        <div class="solution-content">${question.solution}</div>
        <div class="assessment-buttons">
          <button class="assessment-btn correct-btn">✓</button>
          <button class="assessment-btn wrong-btn">X</button>
        </div>
      </div>
    `;
   
    const solutionBtn = card.querySelector('.view-solution-btn');
    const solutionContainer = card.querySelector('.solution-container');
    const correctBtn = card.querySelector('.correct-btn');
    const wrongBtn = card.querySelector('.wrong-btn');
  
    solutionBtn.addEventListener('click', () => {
      solutionContainer.classList.add('visible');
      solutionBtn.style.display = 'none';
    });
  
    correctBtn.addEventListener('click', () => {
      updatePoints(5);
      correctBtn.disabled = true;
      wrongBtn.disabled = true;
      showToast('Correct! +5 points');
    });
  
    wrongBtn.addEventListener('click', () => {
      if (points >= 15) {
        updatePoints(-5);
        showToast('Wrong! -5 points');
      } else {
        showToast('You need at least 15 points to lose points!');
      }
      correctBtn.disabled = true;
      wrongBtn.disabled = true;
    });
  
    questionsFeed.appendChild(card);
  }
  
  
  function updatePoints(delta = 0) {
    const oldPoints = points;
    points += delta;
    console.log('Points updated:', { oldPoints, newPoints: points, delta });
    pointsDisplay.textContent = points;
  }
  
  
  function showToast(message) {
    console.log('Showing toast:', message);
    if (!toast) {
      console.error('Toast element not found in the DOM');
      return;
    }
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => {
      toast.classList.remove('visible');
      console.log('Toast hidden');
    }, 2000);
  }
    
  subjectButtons.forEach(button => {
    button.addEventListener('click', () => {
      console.log('Subject changed to:', button.dataset.subject);
      currentSubject = button.dataset.subject;
      currentSubjectDisplay.textContent = currentSubject.charAt(0).toUpperCase() + currentSubject.slice(1);

      subjectButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      

      questionsFeed.innerHTML = '';
      loadedQuestions.clear();
      loadQuestions(currentSubject);
    });
  });
  

  function navigateTo(path) {
    console.log('Navigating to:', path);
    window.location.href = path;
}

  init();