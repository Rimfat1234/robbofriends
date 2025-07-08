// Global variables
let currentUser = null;
let students = JSON.parse(localStorage.getItem('students')) || [];
let votes = JSON.parse(localStorage.getItem('votes')) || {};
let hasVoted = JSON.parse(localStorage.getItem('hasVoted')) || [];

// Election end date (set to 7 days from now for demo)
const electionEndDate = new Date();
electionEndDate.setDate(electionEndDate.getDate() + 1);

// DOM elements
const authSection = document.getElementById('authSection');
const votingSection = document.getElementById('votingSection');
const resultsSection = document.getElementById('resultsSection');
const successMessage = document.getElementById('successMessage');
const notification = document.getElementById('notification');

// Auth form elements
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    startCountdown();
    setupEventListeners();
});

function initializeApp() {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showVotingSection();
    } else {
        showAuthSection();
    }
    
    // Initialize vote counts if not exists
    if (Object.keys(votes).length === 0) {
        initializeVoteCounts();
    }
}

function initializeVoteCounts() {
    const positions = ['sug', 'vp', 'secretary', 'treasurer'];
    const candidates = ['Nansoh', 'Nankpak', 'Zwalnan'];
    
    positions.forEach(position => {
        votes[position] = {};
        candidates.forEach(candidate => {
            votes[position][candidate] = 0;
        });
    });
    
    localStorage.setItem('votes', JSON.stringify(votes));
}

function setupEventListeners() {
    // Auth tab switching
    loginTab.addEventListener('click', () => switchTab('login'));
    signupTab.addEventListener('click', () => switchTab('signup'));
    
    // Form submissions
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    
    // Voting actions
    document.getElementById('submitVote').addEventListener('click', handleVoteSubmission);
    document.getElementById('resetVote').addEventListener('click', resetVoteSelections);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('viewResults').addEventListener('click', showResults);
    
    // Candidate selection highlighting
    setupCandidateSelection();
}

function switchTab(tab) {
    if (tab === 'login') {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
    } else {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('loginStudentId').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Find student
    const student = students.find(s => s.studentId === studentId && s.password === password);
    
    if (student) {
        currentUser = student;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification('Login successful!', 'success');
        showVotingSection();
    } else {
        showNotification('Invalid matruculation number!', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const studentId = document.getElementById('signupStudentId').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const department = document.getElementById('signupDepartment').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords mismatch!', 'error');
        return;
    }
    
    if (students.find(s => s.studentId === studentId)) {
        showNotification('Student matric number already exists!', 'error');
        return;
    }
    
    if (students.find(s => s.email === email)) {
        showNotification('Email already registered!', 'error');
        return;
    }
    
    // Create new student
    const newStudent = {
        name,
        studentId,
        email,
        department,
        password,
        registeredAt: new Date().toISOString()
    };
    
    students.push(newStudent);
    localStorage.setItem('students', JSON.stringify(students));
    
    showNotification('Registration successful! Please login.', 'success');
    switchTab('login');
    
    // Clear form
    signupForm.reset();
}

function showVotingSection() {
    authSection.classList.add('hidden');
    votingSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    
    // Update welcome message
    document.getElementById('welcomeMessage').textContent = `Welcome, ${currentUser.name}`;
    
    // Check if user has already voted
    if (hasVoted.includes(currentUser.studentId)) {
        showNotification('You have already voted in this election!', 'warning');
        document.getElementById('submitVote').disabled = true;
        document.getElementById('submitVote').textContent = 'Already Voted';
        
        // Disable all radio buttons
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => radio.disabled = true);
    }
}

function showAuthSection() {
    authSection.classList.remove('hidden');
    votingSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    successMessage.classList.add('hidden');
}

function setupCandidateSelection() {
    const candidateCards = document.querySelectorAll('.candidate-card');
    
    candidateCards.forEach(card => {
        const radio = card.querySelector('input[type="radio"]');
        const voteBtn = card.querySelector('.vote-btn');
        
        voteBtn.addEventListener('click', () => {
            if (!radio.disabled) {
                radio.checked = true;
                updateCandidateSelection(radio.name);
            }
        });
        
        radio.addEventListener('change', () => {
            updateCandidateSelection(radio.name);
        });
    });
}

function updateCandidateSelection(position) {
    const cards = document.querySelectorAll(`input[name="${position}"]`).forEach(radio => {
        const card = radio.closest('.candidate-card');
        if (radio.checked) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

function handleVoteSubmission() {
    if (hasVoted.includes(currentUser.studentId)) {
        showNotification('You have already voted!', 'error');
        return;
    }
    
    const positions = ['sug', 'vp', 'secretary', 'treasurer'];
    const userVotes = {};
    let allPositionsFilled = true;
    
    // Collect votes
    positions.forEach(position => {
        const selectedCandidate = document.querySelector(`input[name="${position}"]:checked`);
        if (selectedCandidate) {
            userVotes[position] = selectedCandidate.value;
        } else {
            allPositionsFilled = false;
        }
    });
    
    if (!allPositionsFilled) {
        showNotification('Please vote for all positions!', 'warning');
        return;
    }
    
    // Confirm vote submission
    if (confirm('Are you sure you want to submit your votes? This action cannot be undone.')) {
        // Update vote counts
        positions.forEach(position => {
            const candidate = userVotes[position];
            votes[position][candidate]++;
        });
        
        // Mark user as voted
        hasVoted.push(currentUser.studentId);
        
        // Save to localStorage
        localStorage.setItem('votes', JSON.stringify(votes));
        localStorage.setItem('hasVoted', JSON.stringify(hasVoted));

        // Show success message
        successMessage.classList.remove('hidden');
        showNotification('Vote submitted successfully!', 'success');
    }
}
function resetVoteSelections() {
    if (hasVoted.includes(currentUser.studentId)) {
        showNotification('Cannot reset - you have already voted!', 'error');
        return;
    }
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.checked = false;
    });
    
    const candidateCards = document.querySelectorAll('.candidate-card');
    candidateCards.forEach(card => {
        card.classList.remove('selected');
    });
    showNotification('Vote selections reset!', 'success');
}
function showResults() {
    successMessage.classList.add('hidden');
    votingSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    displayResults();
}

function displayResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    const positions = {
        'sug': 'Student Union Government President',
        'vp': 'Vice President',
        'secretary': 'Secretary',
        'treasurer': 'Treasurer'
    };
    
    let resultsHTML = '';
    
    Object.keys(positions).forEach(position => {
        const positionVotes = votes[position];
        const sortedCandidates = Object.entries(positionVotes)
            .sort(([,a], [,b]) => b - a);
        
        resultsHTML += `
            <div class="result-category">
                <h3>${positions[position]}</h3>
        `;
        
        sortedCandidates.forEach(([candidate, voteCount], index) => {
            const isWinner = index === 0 && voteCount > 0;
            resultsHTML += `
                <div class="result-item ${isWinner ? 'winner' : ''}">
                    <span class="result-name">${candidate} ${isWinner ? '👑' : ''}</span>
                    <span class="result-votes">${voteCount} votes</span>
                </div>
            `;
        });
        
        resultsHTML += '</div>';
    });
    
    resultsContainer.innerHTML = resultsHTML;
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showAuthSection();
        showNotification('Logged out successfully!', 'success');
        
        // Reset forms
        loginForm.reset();
        signupForm.reset();
    }
}

function startCountdown() {
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = electionEndDate.getTime() - now;
        
        if (distance < 0) {
            document.getElementById('countdown').innerHTML = '<div class="countdown-item"><span>ENDED</span><label>Election</label></div>';
            
            // Disable voting if election has ended
            const submitBtn = document.getElementById('submitVote');
            const resetBtn = document.getElementById('resetVote');
            const radioButtons = document.querySelectorAll('input[type="radio"]');
            
            if (submitBtn) submitBtn.disabled = true;
            if (resetBtn) resetBtn.disabled = true;
            radioButtons.forEach(radio => radio.disabled = true);
            
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Demo data for testing (remove in production)
function addDemoData() {
    if (students.length === 0) {
        const demoStudents = [
            {
                name: 'Nansoh kumkur',
                studentId: 'PLASU/2020/FNAS/0463',
                email: 'nansohkumkurrimfat@gmail.com',
                department: 'Computer Science',
                password: 'password123',
                registeredAt: new Date().toISOString()
            },
            {
                name: 'Jane Smith',
                studentId: 'STU002',
                email: 'jane@example.com',
                department: 'Engineering',
                password: 'password123',
                registeredAt: new Date().toISOString()
            }
        ];
        
        students.push(...demoStudents);
        localStorage.setItem('students', JSON.stringify(students));
    }
}

// Uncomment the line below to add demo data for testing
// addDemoData();