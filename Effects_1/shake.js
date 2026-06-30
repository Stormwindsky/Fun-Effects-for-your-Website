(function() {
    // 1. Creation of CSS styles for the shake animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shakeEffect {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
        }

        .screen-shake {
            animation: shakeEffect 0.4s; /* Shake duration */
            animation-iteration-count: 1;
        }
    `;
    document.head.appendChild(style);

    // 2. Keyboard event listener
    window.addEventListener('keydown', (event) => {
        // Avoid restarting the animation if it is already running
        if (!document.body.classList.contains('screen-shake')) {
            document.body.classList.add('screen-shake');

            // 3. Remove the class after the animation ends to allow restarting
            setTimeout(() => {
                document.body.classList.remove('screen-shake');
            }, 400); // Must match the CSS duration (0.4s)
        }
    });
})();
