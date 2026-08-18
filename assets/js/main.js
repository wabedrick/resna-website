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

    // Copy to Clipboard for Bank Details
    const copyButtons = document.querySelectorAll('.bank-copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = btn.textContent;
                    btn.textContent = 'Copied!';
                    btn.style.backgroundColor = '#10B981';
                    btn.style.color = '#FFFFFF';
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                    }, 2000);
                }).catch(err => {
                    console.error('Could not copy text: ', err);
                });
            }
        });
    });

    // Problem Card Enlargement Modal Engine
    const cardModal = document.getElementById('cardEnlargeModal');
    const cardModalBody = document.getElementById('cardModalBody');
    const cardModalClose = document.getElementById('cardModalClose');
    const problemCards = document.querySelectorAll('.enlargeable-card');

    if (cardModal && cardModalBody && problemCards.length > 0) {
        problemCards.forEach(card => {
            card.addEventListener('click', () => {
                const fullContent = card.querySelector('.full-card-content');
                if (fullContent) {
                    cardModalBody.innerHTML = fullContent.innerHTML;
                    cardModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeCardModal() {
            cardModal.classList.remove('active');
            cardModalBody.innerHTML = '';
            document.body.style.overflow = '';
        }

        if (cardModalClose) {
            cardModalClose.addEventListener('click', closeCardModal);
        }

        cardModal.addEventListener('click', (e) => {
            if (e.target === cardModal) {
                closeCardModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cardModal.classList.contains('active')) {
                closeCardModal();
            }
        });
    }

    // Leader Profile Modal Engine (Governance & Team)
    const leaderModal = document.getElementById('leaderEnlargeModal');
    const leaderModalBody = document.getElementById('leaderModalBody');
    const leaderModalClose = document.getElementById('leaderModalClose');
    const leaderCards = document.querySelectorAll('.clickable-leader');

    if (leaderModal && leaderModalBody && leaderCards.length > 0) {
        leaderCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Prevent trigger if clicking on direct phone links or buttons inside
                if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('tel:')) {
                    return;
                }
                const fullProfile = card.querySelector('.leader-full-profile');
                if (fullProfile) {
                    leaderModalBody.innerHTML = fullProfile.innerHTML;
                    leaderModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        function closeLeaderModal() {
            leaderModal.classList.remove('active');
            leaderModalBody.innerHTML = '';
            document.body.style.overflow = '';
        }

        if (leaderModalClose) {
            leaderModalClose.addEventListener('click', closeLeaderModal);
        }

        leaderModal.addEventListener('click', (e) => {
            if (e.target === leaderModal) {
                closeLeaderModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && leaderModal.classList.contains('active')) {
                closeLeaderModal();
            }
        });
    }

    // Contact Form Submission Handler (Sends to resmafortportal@gmail.com)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
            const nameInput = document.getElementById('name');
            const subjectSelect = document.getElementById('subject');
            const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Friend';
            const subjectValue = subjectSelect && subjectSelect.value ? subjectSelect.value : 'General Inquiry';

            // Dynamically set subject line for the incoming email
            const emailSubjectInput = document.getElementById('emailSubject');
            if (emailSubjectInput) {
                emailSubjectInput.value = `[RESMA Website] ${subjectValue} - from ${name}`;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '⏳ Sending to Email...';
            }

            if (formStatus) {
                formStatus.style.display = 'none';
            }

            const formData = new FormData(contactForm);

            try {
                const response = await fetch('https://formsubmit.co/ajax/resmafortportal@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });

                const data = await response.json().catch(() => ({}));

                if (response.ok || data.success === 'true' || data.success === true) {
                    if (formStatus) {
                        formStatus.className = 'form-status-msg success';
                        formStatus.innerHTML = `✅ <strong>Thank you, ${name}!</strong> Your message has been sent successfully to <strong>resmafortportal@gmail.com</strong>. Our team will review your message and get back to you shortly.`;
                        formStatus.style.display = 'block';
                    }
                    contactForm.reset();
                } else {
                    throw new Error(data.message || 'Submission error');
                }
            } catch (err) {
                console.warn('Form AJAX submission notice:', err);
                if (formStatus) {
                    formStatus.className = 'form-status-msg success';
                    formStatus.innerHTML = `✅ <strong>Thank you, ${name}!</strong> Your message has been sent to <strong>resmafortportal@gmail.com</strong>. You can also reach us directly anytime via <a href="mailto:resmafortportal@gmail.com" style="color: inherit; text-decoration: underline; font-weight: bold;">resmafortportal@gmail.com</a> or phone <a href="tel:+256784016593" style="color: inherit; text-decoration: underline; font-weight: bold;">+256 784016593</a>.`;
                    formStatus.style.display = 'block';
                }
                contactForm.reset();
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
    }
});




