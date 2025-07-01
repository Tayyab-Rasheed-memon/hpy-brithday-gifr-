document.addEventListener('DOMContentLoaded', () => {

    // --- REFINED 3D BACKGROUND ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    // Stars with twinkling effect
    const starVertices = [];
    const starColors = [];
    const starPhases = [];
    const baseColors = [new THREE.Color(0xffffff), new THREE.Color(0xffdcc4), new THREE.Color(0xc4d7ff)];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starVertices.push(x, y, z);
        const color = baseColors[Math.floor(Math.random() * baseColors.length)];
        starColors.push(color.r, color.g, color.b);
        starPhases.push(Math.random() * Math.PI * 2);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    const starMaterial = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        // Twinkle effect
        starMaterial.opacity = 0.5 + Math.sin(elapsedTime * 2) * 0.25;
        stars.rotation.y += 0.0001;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => { /* ... same as before ... */ });

    // --- REFINED CONSTELLATION GAME ---
    const starsContainer = document.getElementById('constellation-container');
    const lineSvg = document.getElementById('line-svg');
    const gameStars = document.querySelectorAll('.star');
    const cardModal = document.getElementById('birthday-card');
    const successSound = document.getElementById('success-sound');
    const clickSound = document.getElementById('click-sound');
    let clickOrder = 1;
    let lastClickedStar = null;

    gameStars.forEach(star => {
        star.addEventListener('click', () => {
            if (star.classList.contains('clicked')) return;
            const order = parseInt(star.dataset.order);

            if (order === clickOrder) {
                clickSound.play();
                star.classList.add('clicked');
                if (lastClickedStar) drawAnimatedLine(lastClickedStar, star);
                lastClickedStar = star;
                
                if (clickOrder === gameStars.length) {
                    const firstStar = document.querySelector('.star[data-order="1"]');
                    drawAnimatedLine(star, firstStar);
                    
                    // Final pulse animation
                    gameStars.forEach(s => s.classList.add('completed'));
                    successSound.play();
                    
                    setTimeout(() => {
                        cardModal.showModal();
                        launchHearts();
                    }, 1200);
                }
                clickOrder++;
            } else {
                alert("Oops! Wrong star. Let's try again.");
                resetGame();
            }
        });
    });

    function drawAnimatedLine(star1, star2) {
        const x1 = star1.offsetLeft + star1.offsetWidth / 2;
        const y1 = star1.offsetTop + star1.offsetHeight / 2;
        const x2 = star2.offsetLeft + star2.offsetWidth / 2;
        const y2 = star2.offsetTop + star2.offsetHeight / 2;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line.setAttribute('d', `M${x1},${y1} L${x2},${y2}`);
        line.classList.add('line-path');
        lineSvg.appendChild(line);
    }

    function resetGame() {
        clickOrder = 1;
        lastClickedStar = null;
        gameStars.forEach(s => s.classList.remove('clicked', 'completed'));
        lineSvg.innerHTML = '';
    }

    document.getElementById('close-card').addEventListener('click', () => {
        cardModal.close();
        resetGame();
    });

    // --- REFINED CRYSTAL BALL & OTHER FEATURES ---
    const crystalBall = document.getElementById('crystal-ball');
    const wishText = document.getElementById('wish-text');
    const wishes = ["You are kinder than you know.", "Your smile is a source of joy.", "You have an incredibly strong spirit.", "Wishing you a year of growth and happiness.", "You make the world a better place.", "You are destined for great things."];
    let currentWishIndex = 0;

    crystalBall.addEventListener('click', () => {
        wishText.textContent = wishes[currentWishIndex];
        currentWishIndex = (currentWishIndex + 1) % wishes.length;
        clickSound.play();
    });
    
    // Heart particle effect on modal open
    function launchHearts() {
        const container = document.getElementById('hearts-container');
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart-particle');
            heart.innerHTML = '♥';
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.animationDelay = `${Math.random() * 2}s`;
            heart.style.fontSize = `${Math.random() * 10 + 10}px`;
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 4000);
        }
    }

    // Start music
    document.body.addEventListener('click', () => {
        document.getElementById('music').play();
    }, { once: true });
});




























// document.addEventListener('DOMContentLoaded', () => {
//     const book = document.getElementById('book');
//     const prevBtn = document.getElementById('prev-btn');
//     const nextBtn = document.getElementById('next-btn');
//     const pages = document.querySelectorAll('.book .page');
//     const wishHearts = document.querySelectorAll('.wish-heart');
//     const popup = document.getElementById('wish-popup');
//     const popupText = document.getElementById('popup-text');
//     const closePopupBtn = document.getElementById('close-popup');
    
//     // Audio elements
//     const music = document.getElementById('music');
//     const pageTurnSound = document.getElementById('page-turn-sound');

//     let currentLocation = 1;
//     const maxLocation = pages.length + 1;

//     // Start music on first interaction
//     document.body.addEventListener('click', () => {
//         if (music.paused) music.play();
//     }, { once: true });

//     // Page turn logic
//     prevBtn.addEventListener('click', goPrevPage);
//     nextBtn.addEventListener('click', goNextPage);

//     function goNextPage() {
//         if (currentLocation < maxLocation) {
//             const currentPage = document.querySelector(`.page:nth-child(${currentLocation})`);
//             if (currentPage) {
//                 currentPage.classList.add('flipped');
//                 pageTurnSound.play();
//                 currentLocation++;
//                 // Trigger animation on new page
//                 if(currentLocation === 6) typeLetter();
//             }
//         }
//     }

//     function goPrevPage() {
//         if (currentLocation > 1) {
//             currentLocation--;
//             const prevPage = document.querySelector(`.page:nth-child(${currentLocation})`);
//             if (prevPage) {
//                 prevPage.classList.remove('flipped');
//                 pageTurnSound.play();
//             }
//         }
//     }

//     // Wish popup logic
//     wishHearts.forEach(heart => {
//         heart.addEventListener('click', () => {
//             const wish = heart.getAttribute('data-wish');
//             popupText.textContent = wish;
//             popup.classList.remove('popup-hidden');
//         });
//     });

//     closePopupBtn.addEventListener('click', () => {
//         popup.classList.add('popup-hidden');
//     });
    
//     // Handwriting animation logic
//     const letterTextElement = document.getElementById('letter-text');
//     const letterContent = "Janamdin bohot mubarak ho, Mehwish! \nYeh kitaab sirf kuch panno ka collection nahi, balki unn yaadon aur duaon ka hissa hai jo hum share karte hain. Dua hai ki aapki zindagi ki kitaab ka har panna khushiyon, pyaar, aur kamiyabi se likha jaaye. \nAap jaisi ho, waisi hi hamesha rehna - amazing and wonderful!";
//     let i = 0;

//     function typeLetter() {
//         letterTextElement.textContent = "";
//         i = 0;
//         function type() {
//             if (i < letterContent.length) {
//                 letterTextElement.innerHTML += letterContent.charAt(i);
//                 i++;
//                 setTimeout(type, 50); // Speed of typing
//             }
//         }
//         type();
//     }
// });































// document.addEventListener('DOMContentLoaded', () => {

//     // Get all necessary elements from the DOM
//     const startScreen = document.getElementById('startScreen');
//     const startButton = document.getElementById('startButton');
//     const mainContent = document.getElementById('mainContent');
//     const birthdayAudio = document.getElementById('birthdayAudio');
//     const wishCard = document.getElementById('wishCard');

//     // Confetti settings
//     const confettiSettings = {
//         target: 'confetti-canvas',
//         max: 150,
//         size: 1.5,
//         animate: true,
//         props: ['circle', 'square', 'triangle', 'line'],
//         colors: [[243, 198, 35], [123, 81, 176], [255, 255, 255]],
//         clock: 30,
//         rotate: true,
//         width: window.innerWidth,
//         height: window.innerHeight,
//         start_from_edge: true,
//         respawn: false
//     };

//     const confetti = new ConfettiGenerator(confettiSettings);

//     // Event listener for the start button
//     startButton.addEventListener('click', () => {
//         // Fade out the start screen
//         startScreen.style.opacity = '0';
//         setTimeout(() => {
//             startScreen.style.display = 'none';
//         }, 1000);

//         // Show the main content
//         mainContent.style.display = 'block';

//         // Play birthday music
//         birthdayAudio.play().catch(error => {
//             console.log("Audio autoplay was blocked. User interaction is required.");
//         });

//         // Start confetti effect
//         confetti.render();
//     });

//     // Add click event to the wish card to flip it
//     wishCard.addEventListener('click', () => {
//         wishCard.classList.toggle('is-flipped');
//     });

//     // Re-add the class for CSS to handle the hover effect correctly
//     wishCard.addEventListener('mouseenter', () => {
//         if (!wishCard.classList.contains('is-flipped')) {
//             wishCard.style.transform = 'scale(1.05)';
//         }
//     });
//     wishCard.addEventListener('mouseleave', () => {
//          wishCard.style.transform = 'scale(1)';
//     });

// });