// ============================================================
// script.js – Nail Studio Gallery (Professional)
// ============================================================

// ─── Sample Nail Designs ───
const nailDesigns = [
    {
        id: 1,
        name: "Classic French",
        description: "Elegant white tips with a soft pink base.",
        image: "https://images.unsplash.com/photo-1604654894610-df63d536a6cd?w=400&h=400&fit=crop"
    },
    {
        id: 2,
        name: "Glitter Galaxy",
        description: "Deep blue with shimmering gold glitter.",
        image: "https://images.unsplash.com/photo-1601054266520-c1d11bbd34f6?w=400&h=400&fit=crop"
    },
    {
        id: 3,
        name: "Ombre Rose",
        description: "Soft pink to rose-gold gradient.",
        image: "https://images.unsplash.com/photo-1610992015592-6a1b174aa2da?w=400&h=400&fit=crop"
    },
    {
        id: 4,
        name: "Bold Red",
        description: "Classic, daring, and always in style.",
        image: "https://images.unsplash.com/photo-1590426461857-ffc240af2c64?w=400&h=400&fit=crop"
    },
    {
        id: 5,
        name: "Pastel Dream",
        description: "Soft pastel colors with a matte finish.",
        image: "https://images.unsplash.com/photo-1625836440335-33df0b568956?w=400&h=400&fit=crop"
    },
    {
        id: 6,
        name: "Crystal Sparkle",
        description: "Crystal-clear tips with tiny rhinestones.",
        image: "https://images.unsplash.com/photo-1630582221668-92d3173322cf?w=400&h=400&fit=crop"
    }
];

// ─── Render Gallery ───
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';

    nailDesigns.forEach(item => {
        const div = document.createElement('div');
        div.className = 'gallery-item';

        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" loading="lazy">
            <div class="info">
                <div class="name">${item.name}</div>
                <div class="desc">${item.description}</div>
            </div>
        `;

        grid.appendChild(div);
    });
}

// ─── Share Functions ───
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
renderGallery();
