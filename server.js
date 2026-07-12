// ============================================================
// script.js – Nail Poll Gallery
// ============================================================

// ─── Sample Nail Designs ───
const nailDesigns = [
    {
        id: 1,
        name: "Classic French",
        description: "Elegant white tips with a soft pink base.",
        image: "https://images.unsplash.com/photo-1604654894610-df63d536a6cd?w=400&h=400&fit=crop",
        votes: 0
    },
    {
        id: 2,
        name: "Glitter Galaxy",
        description: "Deep blue with shimmering gold glitter.",
        image: "https://images.unsplash.com/photo-1601054266520-c1d11bbd34f6?w=400&h=400&fit=crop",
        votes: 0
    },
    {
        id: 3,
        name: "Ombre Rose",
        description: "Soft pink to rose-gold gradient.",
        image: "https://images.unsplash.com/photo-1610992015592-6a1b174aa2da?w=400&h=400&fit=crop",
        votes: 0
    },
    {
        id: 4,
        name: "Bold Red",
        description: "Classic, daring, and always in style.",
        image: "https://images.unsplash.com/photo-1590426461857-ffc240af2c64?w=400&h=400&fit=crop",
        votes: 0
    },
    {
        id: 5,
        name: "Pastel Dream",
        description: "Soft pastel colors with a matte finish.",
        image: "https://images.unsplash.com/photo-1625836440335-33df0b568956?w=400&h=400&fit=crop",
        votes: 0
    },
    {
        id: 6,
        name: "Crystal Sparkle",
        description: "Crystal-clear tips with tiny rhinestones.",
        image: "https://images.unsplash.com/photo-1630582221668-92d3173322cf?w=400&h=400&fit=crop",
        votes: 0
    }
];

// ─── State ───
let selectedId = null;
let galleryData = [];

// ─── Load from localStorage ───
function loadGallery() {
    const saved = localStorage.getItem('nailPollData');
    if (saved) {
        const parsed = JSON.parse(saved);
        galleryData = nailDesigns.map(design => {
            const found = parsed.find(p => p.id === design.id);
            return found ? { ...design, votes: found.votes } : design;
        });
    } else {
        galleryData = [...nailDesigns];
    }
}

// ─── Save to localStorage ───
function saveGallery() {
    localStorage.setItem('nailPollData', JSON.stringify(galleryData));
}

// ─── Render Gallery ───
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';

    galleryData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'gallery-item' + (selectedId === item.id ? ' selected' : '');
        div.dataset.id = item.id;

        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="info">
                <div class="name">${item.name}</div>
                <div class="desc">${item.description}</div>
                <div class="vote-count">❤️ ${item.votes} vote${item.votes !== 1 ? 's' : ''}</div>
            </div>
        `;

        div.addEventListener('click', () => selectDesign(item.id));
        grid.appendChild(div);
    });

    updateVoteButton();
}

// ─── Select a design ───
function selectDesign(id) {
    selectedId = id;
    renderGallery();
}

// ─── Update vote button ───
function updateVoteButton() {
    const btn = document.getElementById('voteBtn');
    if (selectedId !== null) {
        const name = galleryData.find(d => d.id === selectedId)?.name || '';
        btn.disabled = false;
        btn.textContent = `🗳️ Vote for "${name}"`;
    } else {
        btn.disabled = true;
        btn.textContent = '🗳️ Vote Now (select a design)';
    }
}

// ─── Cast a vote ───
document.getElementById('voteBtn').addEventListener('click', () => {
    if (selectedId === null) return;
    const design = galleryData.find(d => d.id === selectedId);
    if (design) {
        design.votes += 1;
        saveGallery();
        renderGallery();
        const btn = document.getElementById('voteBtn');
        btn.textContent = '✅ Vote Cast!';
        setTimeout(() => updateVoteButton(), 1200);
    }
});

// ─── Reset selection ───
document.getElementById('resetBtn').addEventListener('click', () => {
    selectedId = null;
    renderGallery();
});

// ─── Show results ───
document.getElementById('showResultsBtn').addEventListener('click', () => {
    const container = document.getElementById('resultsContainer');

    if (container.classList.contains('show')) {
        container.classList.remove('show');
        document.getElementById('showResultsBtn').textContent = '📊 Show Results';
        return;
    }

    const sorted = [...galleryData].sort((a, b) => b.votes - a.votes);
    const totalVotes = galleryData.reduce((sum, d) => sum + d.votes, 0);

    let html = '<h4 style="margin-top:0; margin-bottom:12px;">📊 Poll Results</h4>';
    sorted.forEach((item, index) => {
        const percentage = totalVotes > 0 ? Math.round((item.votes / totalVotes) * 100) : 0;
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        html += `
            <div class="result-item">
                <span class="r-name">${medal} ${item.name}</span>
                <div class="r-bar">
                    <div class="fill" style="width: ${percentage}%;"></div>
                </div>
                <span class="r-votes">${item.votes} (${percentage}%)</span>
            </div>
        `;
    });

    container.innerHTML = html;
    container.classList.add('show');
    document.getElementById('showResultsBtn').textContent = '📊 Hide Results';
});

// ─── Share ───
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('✅ Link copied to clipboard!');
    }).catch(() => {
        prompt('📋 Copy this link manually:', url);
    });
}

// ─── Init ───
loadGallery();
renderGallery();

// ─── Re-render when page becomes visible ───
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        loadGallery();
        renderGallery();
    }
});
