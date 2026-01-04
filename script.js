var c = document.getElementById('c'), ctx = c.getContext('2d'),
    w = c.width = window.innerWidth, h = c.height = window.innerHeight,
    letters = [], opts = { strings: ['HAPPY', 'BIRTHDAY', 'AMMA'], charSpacing: 110, lineHeight: 140 };

function setupInteractions() {
    const panels = document.querySelectorAll('.floating-panel');
    const overlay = document.getElementById('fullview-overlay');
    const imgContainer = document.getElementById('image-container');
    const innerQ = document.getElementById('inner-quote');

    panels.forEach((p) => {
        p.onclick = () => {
            const quote = p.getAttribute('data-quote');
            imgContainer.innerHTML = `<img src="${p.querySelector('img').src}" class="full-img-zoom">`;
            innerQ.innerText = quote;
            overlay.style.display = 'flex';
        };
    });
    overlay.onclick = () => overlay.style.display = 'none';
}

function Letter(char, x, y) {
    this.char = char; this.x = x; this.y = y;
    this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
}

Letter.prototype.step = function() {
    this.y -= 5;
    ctx.fillStyle = this.color;
    ctx.beginPath(); ctx.arc(this.x, this.y, 30, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = 'bold 30px Arial';
    ctx.fillText(this.char, this.x - 10, this.y + 10);
};

function anim() {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0,0,w,h);
    ctx.translate(w/2, h/2);
    let allOut = true;
    letters.forEach(l => { l.step(); if (l.y > -h) allOut = false; });
    ctx.translate(-w/2, -h/2);

    if (allOut && letters.length > 0) {
        document.getElementById('gift-container').style.display = 'flex';
        initGiftLogic();
        return;
    }
    requestAnimationFrame(anim);
}

function initGiftLogic() {
    const wrapper = document.getElementById('gift-wrapper');
    const bike = document.getElementById('delivery-bike');
    wrapper.onclick = () => {
        wrapper.classList.add('open-lid');
        setTimeout(() => {
            bike.classList.add('bike-go');
            setTimeout(() => {
                document.getElementById('gift-container').style.display = 'none';
                document.getElementById('final-scene').style.display = 'flex';
                setupInteractions();
            }, 8000); 
        }, 1000);
    };
}

opts.strings.forEach((str, i) => {
    let rowY = (i - 1) * opts.lineHeight + 400;
    for (let j = 0; j < str.length; j++) {
        letters.push(new Letter(str[j], (j - str.length / 2) * opts.charSpacing, rowY));
    }
});
anim();