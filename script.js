document.addEventListener('DOMContentLoaded', () => {
	const words = [
		'apple','banana','cherry','diamond','eclipse','feather','galaxy','harbor','island','jungle',
		'kettle','lighthouse','meadow','nectar','oasis','pendulum','quartz','ripple','saffron','tundra',
		'umbrella','valley','whisper','xylophone','yonder','zephyr','anchor','bold','compass','dawn',
		'ember','flint','glow','horizon','ivy'
	];

	const wordEl = document.querySelector('#word');
	const btn = document.querySelector('#generate-btn');
	const timerContainer = document.querySelector('.timer-container');
	const ring = document.querySelector('.progress-ring__circle');
	const timerText = document.querySelector('.timer-text');

	if (!wordEl || !btn || !timerContainer || !ring || !timerText) return;

	// Initialize progress ring (robustly read radius from SVG or fallback)
	const radius = (() => {
		const rAttr = ring.getAttribute && ring.getAttribute('r');
		if (rAttr && !Number.isNaN(parseFloat(rAttr))) return parseFloat(rAttr);
		if (ring.r && ring.r.baseVal && typeof ring.r.baseVal.value === 'number') return ring.r.baseVal.value;
		if (typeof ring.getBBox === 'function') {
			try {
				const b = ring.getBBox();
				return Math.max(b.width, b.height) / 2 || 16;
			} catch (e) {
				// ignore
			}
		}
		return 16;
	})();
	const circumference = 2 * Math.PI * radius;
	ring.style.strokeDasharray = `${circumference} ${circumference}`;
	ring.style.strokeDashoffset = '0';
	ring.style.transition = 'stroke-dashoffset 1s linear';

	// Helper: pick a random word
	const randomWord = () => words[Math.floor(Math.random() * words.length)];

	// Easing used to space out the ticks (fast -> slow)
	function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

	// Start the dramatic slot-machine spin
	function startSpin() {
		if (btn.disabled) return;
		btn.disabled = true;
		// hide timer while spinning
		timerContainer.classList.add('hidden');

		wordEl.classList.add('shaking');

		const ticks = 40; // number of visible changes
		const totalTime = 3000 + Math.random() * 1000; // 3000-4000ms
		const scheduleTimes = [];
		for (let i = 0; i < ticks; i++) {
			const p = i / (ticks - 1);
			scheduleTimes.push(easeOutCubic(p) * totalTime);
		}

		// Schedule word changes
		for (let i = 0; i < scheduleTimes.length; i++) {
			const when = scheduleTimes[i];
			setTimeout(() => {
				wordEl.textContent = randomWord();
			}, when);
		}

		// Stop after totalTime + tiny buffer
		setTimeout(() => stopSpin(), totalTime + 60);
	}

	// Called when spinning finishes
	function stopSpin() {
		wordEl.classList.remove('shaking');
		wordEl.classList.add('pop');
		setTimeout(() => wordEl.classList.remove('pop'), 200);

		// Reveal timer and start countdown
		timerContainer.classList.remove('hidden');

		// Reset ring and start countdown from 60
		ring.style.transition = 'stroke-dashoffset 1s linear';
		ring.style.strokeDashoffset = '0';
		startTimer(60);
	}

	// Countdown timer with circular progress
	function startTimer(seconds) {
		let remaining = seconds;
		timerText.textContent = String(remaining);
		ring.style.strokeDashoffset = '0';

		const total = seconds;
		const tick = setInterval(() => {
			remaining -= 1;
			const display = Math.max(0, remaining);
			timerText.textContent = String(display);

			const elapsed = total - display;
			const offset = (elapsed / total) * circumference;
			ring.style.strokeDashoffset = String(offset);

			if (remaining <= 0) {
				clearInterval(tick);
				// Ensure final state
				timerText.textContent = '0';
				ring.style.strokeDashoffset = String(circumference);
				btn.disabled = false;
			}
		}, 1000);
	}

	// Bind UI
	btn.addEventListener('click', startSpin);

	// Initial UI state
	timerContainer.classList.add('hidden');
	wordEl.textContent = randomWord();
});
