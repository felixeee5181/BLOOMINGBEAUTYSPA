// ===== DATA: Nail designs (stored in localStorage for persistence) =====
function getDesigns() {
    const stored = localStorage.getItem('nailDesigns');
    if (stored) {
        return JSON.parse(stored);
    }
    // Default designs if no data exists
    return [
        { id: 1, name: "Rose Gold Glam", image: "images/nail1.jpg", votes: 0 },
        { id: 2, name: "Ombre Dream", image: "images/nail2.jpg", votes: 0 },
        { id: 3, name: "Floral Art", image: "images/nail3.jpg", votes: 0 },
        { id: 4, name: "Sparkle Queen", image: "images/nail4.jpg", votes: 0 },
        { id: 5, name: "Classic French", image: "images/nail5.jpg", votes: 0 },
        { id: 6, name: "Crystal Shine", image: "images/nail6.jpg", votes: 0 }
    ];
}

let nailDesigns = getDesigns();
let selectedDesignId = null;
let hasVoted = false;
let nextId = nailDesigns.length > 0 ? Math.max(...nailDesigns.map(d => d.id)) + 1 : 1;

// ===== SAVE DATA =====
function saveDesigns() {
    localStorage.setItem('nailDesigns', JSON.stringify(nailDesigns));
}

// ===== PAGE NAVIGATION =====
function enterGallery() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('galleryPage').style.display = 'block';
    renderGallery();
    window.scrollTo(0, 0);
}

function goBackToLanding() {
    document.getElementById('galleryPage').style.display = 'none';
    document.getElementById('landingPage').style.display = 'flex';
    window.scrollTo(0, 0);
}

function scrollToContact() {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('galleryPage').style.display = 'block';
    setTimeout(() => {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// ===== RENDER GALLERY =====
function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';
    
    if (nailDesigns.length === 0) {
        galleryGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #7a5a5a;">
                <p style="font-size: 18px;">No designs yet. Upload your first nail art!</p>
            </div>
        `;
        return;
    }
    
    nailDesigns.forEach(design => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.id = design.id;
        
        // Use placeholder if image fails to load
        const imgSrc = design.image || `https://via.placeholder.com/200x200/ff6b8a/ffffff?text=${encodeURIComponent(design.name)}`;
        
        item.innerHTML = `
            <img src="${imgSrc}" alt="${design.name}" 
                 onerror="this.src='https://via.placeholder.com/200x200/ff6b8a/ffffff?text=${encodeURIComponent(design.name)}'">
            <div class="caption">${design.name}</div>
            <div class="vote-badge">✓ SELECTED</div>
            <button class="delete-btn" onclick="deleteDesign(${design.id})">✕</button>
        `;
        
        item.addEventListener('click', () => selectDesign(design.id));
        galleryGrid.appendChild(item);
    });
    
    // Update vote button state
    updateVoteButton();
}

// ===== SELECT DESIGN =====
function selectDesign(id) {
    if (hasVoted) {
        alert('You have already voted! Click "Reset Selection" to vote again.');
        return;
    }
    
    selectedDesignId = id;
    
    // Update UI
    document.querySelectorAll('.gallery-item').forEach(el => {
        el.classList.toggle('selected', parseInt(el.dataset.id) === id);
    });
    
    updateVoteButton();
    document.getElementById('resultsContainer').innerHTML = '';
}

// ===== UPDATE VOTE BUTTON =====
function updateVoteButton() {
    const voteBtn = document.getElementById('voteBtn');
    voteBtn.disabled = !selectedDesignId || hasVoted;
}

// ===== VOTE =====
document.getElementById('voteBtn').addEventListener('click', function() {
    if (!selectedDesignId || hasVoted) return;
    
    const design = nailDesigns.find(d => d.id === selectedDesignId);
    if (design) {
        design.votes += 1;
        hasVoted = true;
        this.disabled = true;
        saveDesigns();
        
        // Show confirmation
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = `
            <div style="padding: 15px; background: #ff6b8a; color: white; border-radius: 10px;">
                ✅ Thank you! You voted for <strong>${design.name}</strong>
            </div>
        `;
    }
});

// ===== RESET =====
document.getElementById('resetBtn').addEventListener('click', function() {
    selectedDesignId = null;
    hasVoted = false;
    
    document.querySelectorAll('.gallery-item').forEach(el => {
        el.classList.remove('selected');
    });
    
    updateVoteButton();
    document.getElementById('resultsContainer').innerHTML = '';
});

// ===== SHOW RESULTS =====
document.getElementById('showResultsBtn').addEventListener('click', function() {
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (nailDesigns.length === 0) {
        resultsContainer.innerHTML = '<p style="color: #7a5a5a;">No designs to show results for.</p>';
        return;
    }
    
    // Sort by votes (highest first)
    const sorted = [...nailDesigns].sort((a, b) => b.votes - a.votes);
    const totalVotes = nailDesigns.reduce((sum, d) => sum + d.votes, 0);
    
    let html = '<div style="text-align: left; padding: 10px;">';
    html += `<h4 style="color: #4a2d2d; margin-bottom: 15px;">📊 Results (${totalVotes} total votes)</h4>`;
    
    sorted.forEach((design, index) => {
        const percentage = totalVotes > 0 ? Math.round((design.votes / totalVotes) * 100) : 0;
        const isWinner = index === 0 && design.votes > 0;
        
        html += `
            <div style="margin-bottom: 12px; padding: 8px; background: ${isWinner ? '#fff0f5' : 'transparent'}; border-radius: 8px; border: ${isWinner ? '2px solid #ff6b8a' : 'none'};">
                <div style="display: flex; justify-content: space-between; font-weight: ${isWinner ? 'bold' : 'normal'};">
                    <span>${isWinner ? '🏆 ' : ''} ${design.name}</span>
                    <span>${design.votes} votes (${percentage}%)</span>
                </div>
                <div style="background: #ffe4e1; height: 20px; border-radius: 10px; margin-top: 4px; overflow: hidden;">
                    <div style="background: #ff6b8a; height: 100%; width: ${percentage}%; border-radius: 10px; transition: width 0.5s ease;"></div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsContainer.innerHTML = html;
});

// ===== ADMIN: UPLOAD DESIGN =====
function uploadDesign() {
    const nameInput = document.getElementById('designName');
    const fileInput = document.getElementById('designImage');
    const status = document.getElementById('uploadStatus');
    
    const name = nameInput.value.trim();
    const file = fileInput.files[0];
    
    if (!name) {
        status.innerHTML = '<span style="color: #ff6b8a;">⚠️ Please enter a design name</span>';
        return;
    }
    
    if (!file) {
        status.innerHTML = '<span style="color: #ff6b8a;">⚠️ Please select an image file</span>';
        return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
        status.innerHTML = '<span style="color: #ff6b8a;">⚠️ Please upload an image file (JPEG, PNG, etc.)</span>';
        return;
    }
    
    // Read the file as data URL
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        // Add new design
        const newDesign = {
            id: nextId++,
            name: name,
            image: imageData, // Store the actual image data
            votes: 0
        };
        
        nailDesigns.push(newDesign);
        saveDesigns();
        renderGallery();
        
        // Clear form
        nameInput.value = '';
        fileInput.value = '';
        status.innerHTML = '<span style="color: #4CAF50;">✅ Design uploaded successfully!</span>';
        
        setTimeout(() => {
            status.innerHTML = '';
        }, 3000);
    };
    
    reader.onerror = function() {
        status.innerHTML = '<span style="color: #ff6b8a;">❌ Error reading file. Please try again.</span>';
    };
    
    reader.readAsDataURL(file);
}

// ===== ADMIN: DELETE DESIGN =====
function deleteDesign(id) {
    if (!confirm('Are you sure you want to delete this design?')) return;
    
    nailDesigns = nailDesigns.filter(d => d.id !== id);
    saveDesigns();
    renderGallery();
    
    // Reset selection if deleted
    if (selectedDesignId === id) {
        selectedDesignId = null;
        updateVoteButton();
    }
}

// ===== SHARE FUNCTIONS =====
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out these amazing nail designs at Blooming Beauty Spa! 💅');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
}

function shareOnMeta() {
    shareOnFacebook();
}

function shareOnTiktok() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied! Share it on TikTok 📱');
    }).catch(() => {
        prompt('Copy this link to share on TikTok:', url);
    });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if we should show gallery directly (if URL has #gallery)
    if (window.location.hash === '#gallery') {
        enterGallery();
    }
    
    console.log('Blooming Beauty Spa - Nail Gallery & Poll ready!');
    console.log('Admin features: Upload designs using the admin panel');
});