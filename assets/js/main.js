document.addEventListener('DOMContentLoaded', () => {
    // Current Year in Footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Scroll Animations (Intersection Observer)
    const faders = document.querySelectorAll('.fade-in, .section, .activity-card, .activity-card-enhanced, .team-card, .impact-matrix-card, .video-spotlight-card, .gallery-card');

    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        if (!fader.classList.contains('fade-in')) {
            fader.classList.add('fade-in');
        }
        appearOnScroll.observe(fader);
    });

    // Header Background Change on Scroll
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            }
        });
    }

    // ==========================================
    // Gallery Filtering Engine
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');

    if (filterBtns.length > 0 && galleryCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category.includes(filterValue)) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // ==========================================
    // Interactive Lightbox Modal Engine
    // ==========================================
    const lightbox = document.getElementById('lightboxModal');
    const lightboxMedia = document.getElementById('lightboxMedia');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentMediaList = [];
    let currentIndex = 0;

    const mediaItems = document.querySelectorAll('[data-lightbox="true"]');

    if (mediaItems.length > 0 && lightbox) {
        // Collect visible media items
        function updateMediaList() {
            currentMediaList = Array.from(document.querySelectorAll('[data-lightbox="true"]'))
                .filter(item => item.closest('.gallery-card') ? item.closest('.gallery-card').style.display !== 'none' : true);
        }

        function openLightbox(index) {
            updateMediaList();
            if (index < 0 || index >= currentMediaList.length) return;
            currentIndex = index;
            const item = currentMediaList[currentIndex];
            const type = item.getAttribute('data-type');
            const src = item.getAttribute('data-src');
            const caption = item.getAttribute('data-caption') || '';

            lightboxMedia.innerHTML = '';

            if (type === 'video') {
                const videoEl = document.createElement('video');
                videoEl.src = src;
                videoEl.controls = true;
                videoEl.autoplay = true;
                videoEl.playsInline = true;
                lightboxMedia.appendChild(videoEl);
            } else {
                const imgEl = document.createElement('img');
                imgEl.src = src;
                imgEl.alt = caption;
                lightboxMedia.appendChild(imgEl);
            }

            lightboxCaption.textContent = caption;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            lightboxMedia.innerHTML = '';
            document.body.style.overflow = '';
        }

        function showNext() {
            updateMediaList();
            if (currentMediaList.length === 0) return;
            currentIndex = (currentIndex + 1) % currentMediaList.length;
            openLightbox(currentIndex);
        }

        function showPrev() {
            updateMediaList();
            if (currentMediaList.length === 0) return;
            currentIndex = (currentIndex - 1 + currentMediaList.length) % currentMediaList.length;
            openLightbox(currentIndex);
        }

        mediaItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                updateMediaList();
                const clickedIndex = currentMediaList.indexOf(item);
                if (clickedIndex !== -1) {
                    openLightbox(clickedIndex);
                }
            });
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        if (lightboxNext) {
            lightboxNext.addEventListener('click', showNext);
        }
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', showPrev);
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
        });
    }
});

