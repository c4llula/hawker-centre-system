const joinButton = document.querySelector('.join');
const backButton = document.querySelector('.back');
const queueContainer = document.querySelector('.queue-container');
const imageContainer = document.querySelector('.image-container');

let queueCount = 5;
let waitingTime = 20;

joinButton.addEventListener('click', function() {
  if (confirm('Do you want to join the queue?')) {
    queueCount++;
    waitingTime += 4;
    
    document.querySelector('.queue-container p:first-child .highlight').textContent = queueCount;
    document.querySelector('.queue-container p:nth-child(2) .highlight').textContent = waitingTime + '~ mins';
    
    joinButton.textContent = 'Joined';
    joinButton.style.background = '#4CAF50';
    
    setTimeout(() => {
      joinButton.textContent = 'Join Queue';
      joinButton.style.background = 'black';
    }, 2000);
  }
});

backButton.addEventListener('click', function() {
  if (confirm('Are you sure you want to go back?')) {
    window.history.back();
  }
});

const avatar = document.querySelector('.avatar');
avatar.addEventListener('click', function() {
  alert('Owner: Mr. Tan Kah Kee\nExperience: 5 years\nRating: 4.5/5');
});

imageContainer.addEventListener('click', function() {
  const overlay = document.querySelector('.overlay');
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
  
  setTimeout(() => {
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
  }, 300);
});