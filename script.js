document.addEventListener('DOMContentLoaded', function() {
    const loanCheckerWindow = document.getElementById('loanCheckerWindow');
    const loanCheckerHeader = document.getElementById('loanCheckerHeader');
    const checkLoanButton = document.getElementById('checkLoanButton');
    const loanStatus = document.getElementById('loanStatus');
    const closeButton = document.getElementById('closeButton');

    let isDragging = false;
    let offsetX, offsetY;
    let intervalId;

    // Make the window draggable
    loanCheckerHeader.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - loanCheckerWindow.getBoundingClientRect().left;
        offsetY = e.clientY - loanCheckerWindow.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            loanCheckerWindow.style.left = `${e.clientX - offsetX}px`;
            loanCheckerWindow.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Close button functionality
    closeButton.addEventListener('click', function() {
        loanCheckerWindow.style.display = 'none';
    });

    // Check Loan button functionality
    checkLoanButton.addEventListener('click', function() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            checkLoanButton.textContent = 'Check Loan';
        } else {
            checkLoan();
            intervalId = setInterval(checkLoan, 3000);
            checkLoanButton.textContent = 'Pause';
        }
    });

    async function checkLoan() {
        const apiUrl = 'https://api.tycoon.community/loans'; // Replace with the actual API endpoint
        const playerId = 'YOUR_PLAYER_ID'; // Replace with the player's ID or session token

        try {
            const response = await fetch(`${apiUrl}?playerId=${playerId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch loan data');
            }

            const data = await response.json();

            if (data.loan) {
                loanStatus.innerHTML = `
                    <div class="loanName">${data.loan.name}</div>
                    <div class="loanAmount">$${data.loan.amount}</div>
                `;
            } else {
                loanStatus.textContent = 'No Loan';
            }
        } catch (error) {
            console.error('Error fetching loan data:', error);
            loanStatus.textContent = 'Error: Unable to fetch data';
        }
    }
});
