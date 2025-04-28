// === Control how long the trail is ===
const trailLengthFactor = 0.05; // 0.1 (very short) to 1.0 (full length)

const canvas = document.getElementById('wave-canvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let mode = 'trail'; // 'wave' or 'trail'

const mouse = { x: width / 2, y: height / 2, radius: 50 }; // Starting radius

let hue = 0;
let trail = [];
const numTrailPoints = 100; // total points
const pointsToDraw = Math.floor(numTrailPoints * trailLengthFactor); // How many points to connect

let points = [];
const numPointsX = 150;
const numPointsY = 130;
let spacingX = width / numPointsX;
let spacingY = height / numPointsY;

// === Control the wave point size ===
let wavePointSize = 1.9 // Variable to control wave point size, adjust this value

window.addEventListener('mousemove', function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('resize', function () {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    spacingX = width / numPointsX;
    spacingY = height / numPointsY;
    setupWavePoints();
});

// Scroll event to change the cursor radius
window.addEventListener('wheel', function (e) {
    if (e.deltaY > 0) {
        mouse.radius = Math.min(mouse.radius + 5, 200); // Increase radius, max of 200
    } else {
        mouse.radius = Math.max(mouse.radius - 5, 10); // Decrease radius, min of 10
    }
}, { passive: true });

// Create mode switch button
const toggleButton = document.createElement('button');
toggleButton.textContent = 'Switch Mode';
toggleButton.style.position = 'fixed';
toggleButton.style.top = '20px';
toggleButton.style.right = '20px';
toggleButton.style.zIndex = '9999';
toggleButton.style.padding = '10px 20px';
toggleButton.style.background = '#222';
toggleButton.style.color = '#fff';
toggleButton.style.border = 'none';
toggleButton.style.borderRadius = '8px';
toggleButton.style.cursor = 'pointer';
document.body.appendChild(toggleButton);

toggleButton.addEventListener('click', () => {
    mode = (mode === 'wave') ? 'trail' : 'wave';
});

// ======== WAVE MODE =========
function setupWavePoints() {
    points = [];
    for (let y = 0; y <= numPointsY; y++) {
        for (let x = 0; x <= numPointsX; x++) {
            points.push({
                baseX: x * spacingX,
                baseY: y * spacingY,
                x: x * spacingX,
                y: y * spacingY,
                vx: 0,
                vy: 0
            });
        }
    }
}

function updateWave() {
    points.forEach(p => {
        let dx = p.x - mouse.x;
        let dy = p.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            let force = (mouse.radius - distance) / mouse.radius;
            let angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force * 5;
            p.vy += Math.sin(angle) * force * 5;
        }

        p.vx *= 0.9;
        p.vy *= 0.9;

        p.x += p.vx;
        p.y += p.vy;

        let dxBase = p.baseX - p.x;
        let dyBase = p.baseY - p.y;
        p.vx += dxBase * 0.01;
        p.vy += dyBase * 0.01;
    });
}
function drawWave() {
    ctx.clearRect(0, 0, width, height);

    points.forEach(p => {
        let dx = p.x - mouse.x;
        let dy = p.y - mouse.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // === Original ===
        if (distance < mouse.radius) {
            ctx.fillStyle = 'white'; 
        } else {
            ctx.fillStyle = 'gray';
        }

        // === 🔥 New version with your custom colors ===
        // if (distance < mouse.radius) {
        //     ctx.fillStyle = 'cyan';  // Inside radius color
        // } else {
        //     ctx.fillStyle = 'purple'; // Outside radius color
        // }

        ctx.beginPath();
        ctx.arc(p.x, p.y, wavePointSize, 0, Math.PI * 2);
        ctx.fill();
    });
}
// ======== TRAIL MODE =========
// Initialize trail points
for (let i = 0; i < numTrailPoints; i++) {
    trail.push({
        x: mouse.x,
        y: mouse.y,
        angle: Math.random() * Math.PI * 2
    });
}

function updateTrail() {
    // First point sticks to mouse
    trail[0].x += (mouse.x - trail[0].x) * 0.2;
    trail[0].y += (mouse.y - trail[0].y) * 0.2;

    for (let i = 1; i < trail.length; i++) {
        const p = trail[i];
        const prev = trail[i - 1];

        // Random shake
        p.angle += (Math.random() - 0.5) * 0.5;
        p.x += Math.cos(p.angle) * 2;
        p.y += Math.sin(p.angle) * 2;

        // Pull towards previous
        p.x += (prev.x - p.x) * 0.1;
        p.y += (prev.y - p.y) * 0.1;
    }
}

function drawTrail() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, width, height);

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    // Only draw a portion of the trail
    for (let i = 1; i < pointsToDraw; i++) {
        ctx.lineTo(trail[i].x, trail[i].y);
    }

    // Change the whole line color dynamically using hue
    hue += 1; // You can adjust speed of hue shift
    if (hue > 360) hue = 0;
    ctx.strokeStyle = `hsl(${hue}, 100%, 70%)`;

    ctx.stroke();
}

// ======== ANIMATE =========
function animate() {
    if (mode === 'wave') {
        updateWave();
        drawWave();
    } else if (mode === 'trail') {
        updateTrail();
        drawTrail();
    }
    requestAnimationFrame(animate);
}

// ======== START ========
setupWavePoints();
animate();
