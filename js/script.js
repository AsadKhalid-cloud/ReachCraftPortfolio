document.addEventListener('DOMContentLoaded', () => {

    // ================= 1. MOBILE NAVBAR DRAWER LOGIC =================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            if (link) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 900) {
                        e.preventDefault();
                        e.stopPropagation();
                        dropdowns.forEach(other => {
                            if (other !== dropdown) other.classList.remove('open');
                        });
                        dropdown.classList.toggle('open');
                    }
                });
            }
        });

        const subLinks = navMenu.querySelectorAll('.dropdown-menu a, .nav-item:not(.dropdown) .nav-link');
        subLinks.forEach(subLink => {
            subLink.addEventListener('click', () => {
                if (window.innerWidth <= 900) {
                    navMenu.classList.remove('active');
                    const icon = mobileToggle.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-xmark');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // ================= 2. HERO SLIDER LOGIC =================
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');
    const heroSection = document.getElementById('hero');

    if (slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;

        function showSlide(index) {
            if (index >= totalSlides) currentSlide = 0;
            else if (index < 0) currentSlide = totalSlides - 1;
            else currentSlide = index;

            slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
            indicators.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
        }

        function nextSlide() { showSlide(currentSlide + 1); }
        function prevSlide() { showSlide(currentSlide - 1); }
        function startAutoPlay() { slideInterval = setInterval(nextSlide, 5000); }
        function resetAutoPlay() { clearInterval(slideInterval); startAutoPlay(); }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
            prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });
        }

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => { showSlide(index); resetAutoPlay(); });
        });

        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
            heroSection.addEventListener('mouseleave', startAutoPlay);

            let touchStartX = 0;
            let touchEndX = 0;
            heroSection.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
            heroSection.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) { nextSlide(); resetAutoPlay(); }
                else if (touchEndX - touchStartX > 50) { prevSlide(); resetAutoPlay(); }
            }, { passive: true });
        }

        startAutoPlay();
    }

    // ================= 3. DYNAMIC CLIENT REVIEWS & APPROVAL SYSTEM =================
    const reviewsTrack = document.getElementById('reviews-track');
    if (reviewsTrack) {
        const defaultReviews = [
            {
                name: "Hamza Tariq",
                service: "Web Development",
                time: "Recent Client",
                rating: 5,
                text: "Working with ReachCraft has been an outstanding experience. They designed our business website with exceptional quality, fast speed, and modern design. Their team is genuinely attentive to every detail!",
                color: "navy"
            },
            {
                name: "Usman Sheikh",
                service: "Meta Ads & Social Media",
                time: "Recent Client",
                rating: 5,
                text: "Extremely easy to work with! They took over our Meta Ads and social media management, brought wonderful creative ideas to the table, and helped us get consistent customer inquiries on WhatsApp.",
                color: "blue"
            },
            {
                name: "Bilal Ahmed",
                service: "Custom Software & Branding",
                time: "Recent Client",
                rating: 5,
                text: "ReachCraft built a custom billing and management solution for our setup along with our brand logo. Highly responsive, clear communication on WhatsApp, and delivered right on time!",
                color: "teal"
            }
        ];

        let reviewsData = defaultReviews;
        const reviewsDots = document.getElementById('reviews-dots');
        const totalReviewsCount = document.getElementById('total-reviews-count');
        const avgRatingEl = document.getElementById('avg-rating');
        const prevReviewBtn = document.getElementById('prev-review');
        const nextReviewBtn = document.getElementById('next-review');

        let currentReviewIndex = 0;

        function getInitials(name) {
            return (name || 'RC').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        }

        function getCardsPerView() {
            if (window.innerWidth <= 650) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        }

        function renderReviews() {
            reviewsTrack.innerHTML = '';
            reviewsData.forEach((rev) => {
                let starsHTML = '';
                for (let i = 1; i <= 5; i++) {
                    starsHTML += `<i class="fa-${i <= rev.rating ? 'solid' : 'regular'} fa-star"></i>`;
                }

                const card = document.createElement('div');
                card.className = 'review-card';
                card.innerHTML = `
                    <div>
                        <div class="review-stars">${starsHTML}</div>
                        <p class="review-text">"${rev.text}"</p>
                    </div>
                    <div class="reviewer-info">
                        <div class="reviewer-avatar ${rev.color || 'blue'}">
                            ${getInitials(rev.name)}
                            <span class="verified-badge"><i class="fa-solid fa-star"></i></span>
                        </div>
                        <div class="reviewer-meta">
                            <h4>${rev.name}</h4>
                            <span>${rev.service} · ${rev.time || 'Verified Client'}</span>
                        </div>
                    </div>
                `;
                reviewsTrack.appendChild(card);
            });

            const total = reviewsData.length;
            const avg = total > 0 ? (reviewsData.reduce((sum, r) => sum + Number(r.rating), 0) / total).toFixed(1) : '5.0';
            if (totalReviewsCount) totalReviewsCount.textContent = total;
            if (avgRatingEl) avgRatingEl.textContent = avg;

            renderDots();
            updateReviewCarousel();
        }

        function renderDots() {
            if (!reviewsDots) return;
            reviewsDots.innerHTML = '';
            const maxIndex = Math.max(0, reviewsData.length - getCardsPerView());

            for (let i = 0; i <= maxIndex; i++) {
                const dot = document.createElement('button');
                dot.className = `review-dot ${i === currentReviewIndex ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    currentReviewIndex = i;
                    updateReviewCarousel();
                });
                reviewsDots.appendChild(dot);
            }
        }

        function updateReviewCarousel() {
            const cards = reviewsTrack.querySelectorAll('.review-card');
            if (cards.length === 0) return;

            const maxIndex = Math.max(0, reviewsData.length - getCardsPerView());
            if (currentReviewIndex > maxIndex) currentReviewIndex = 0;
            if (currentReviewIndex < 0) currentReviewIndex = maxIndex;

            const cardWidth = cards[0].offsetWidth + 26;
            reviewsTrack.style.transform = `translateX(-${currentReviewIndex * cardWidth}px)`;

            if (reviewsDots) {
                const dots = reviewsDots.querySelectorAll('.review-dot');
                dots.forEach((d, i) => d.classList.toggle('active', i === currentReviewIndex));
            }
        }

        if (nextReviewBtn && prevReviewBtn) {
            nextReviewBtn.addEventListener('click', () => { currentReviewIndex++; updateReviewCarousel(); });
            prevReviewBtn.addEventListener('click', () => { currentReviewIndex--; updateReviewCarousel(); });
        }

        window.addEventListener('resize', () => {
            renderDots();
            updateReviewCarousel();
        });

        // Fetch Approved Reviews from MySQL Database on Page Load
        fetch('/api/reviews')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.reviews.length > 0) {
                    reviewsData = data.reviews;
                }
                renderReviews();
            })
            .catch(() => {
                renderReviews();
            });

        // Modal Logic & Real Visitor Review Submission
        const reviewModal = document.getElementById('review-modal');
        const openModalBtn = document.getElementById('open-review-modal');
        const closeModalBtn = document.getElementById('close-review-modal');
        const reviewForm = document.getElementById('review-form');
        const starIcons = document.querySelectorAll('#star-input i');
        const ratingInput = document.getElementById('review-rating');

        if (openModalBtn && reviewModal) {
            openModalBtn.addEventListener('click', () => reviewModal.classList.add('active'));
            closeModalBtn.addEventListener('click', () => reviewModal.classList.remove('active'));
            reviewModal.addEventListener('click', (e) => {
                if (e.target === reviewModal) reviewModal.classList.remove('active');
            });
        }

        starIcons.forEach(star => {
            star.addEventListener('click', () => {
                const val = Number(star.getAttribute('data-value'));
                ratingInput.value = val;
                starIcons.forEach(s => {
                    s.classList.toggle('active', Number(s.getAttribute('data-value')) <= val);
                });
            });
        });

        // ✅ FIXED: Captures Visitor's Real Name, Service, Rating & Review Text and sends to MySQL as 'pending'
        if (reviewForm) {
            reviewForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const colors = ['blue', 'navy', 'teal'];

                const realVisitorReview = {
                    name: document.getElementById('reviewer-name').value.trim(),
                    service: document.getElementById('reviewer-service').value,
                    rating: Number(ratingInput.value) || 5,
                    text: document.getElementById('reviewer-text').value.trim(),
                    color: colors[reviewsData.length % colors.length],
                    isAdmin: false
                };

                try {
                    const res = await fetch('/api/reviews', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(realVisitorReview)
                    });
                    const data = await res.json();

                    if (data.success) {
                        alert(`✅ Thank you ${realVisitorReview.name}! Your review has been sent to ReachCraft Admin Panel for approval.`);
                    }
                } catch (err) {
                    console.error('Error saving review:', err);
                }

                reviewForm.reset();
                reviewModal.classList.remove('active');
            });
        }
    }

    // ================= 4. PORTFOLIO CATEGORY FILTER LOGIC =================
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');
                const caseCards = document.querySelectorAll('.case-card');

                caseCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === category) {
                        card.classList.remove('hide');
                    } else {
                        card.classList.add('hide');
                    }
                });
            });
        });
    }

    // ================= 5. BLOG FILTER, SEARCH & ARTICLE READER MODAL =================
    const blogFilterBtns = document.querySelectorAll('.blog-filter-btn');
    const blogSearchInput = document.getElementById('blog-search-input');
    const blogModal = document.getElementById('blog-reader-modal');
    const closeBlogModal = document.getElementById('close-blog-modal');

    function filterBlogs() {
        const activeBtn = document.querySelector('.blog-filter-btn.active');
        const category = activeBtn ? activeBtn.getAttribute('data-category') : 'all';
        const query = blogSearchInput ? blogSearchInput.value.toLowerCase().trim() : '';
        const blogCards = document.querySelectorAll('.blog-card');

        blogCards.forEach(card => {
            const cardCat = card.getAttribute('data-category');
            const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
            const desc = card.querySelector('.blog-card-desc').textContent.toLowerCase();

            const matchesCategory = (category === 'all' || cardCat === category);
            const matchesSearch = (title.includes(query) || desc.includes(query));

            card.classList.toggle('hide', !(matchesCategory && matchesSearch));
        });
    }

    blogFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            blogFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterBlogs();
        });
    });

    if (blogSearchInput) {
        blogSearchInput.addEventListener('input', filterBlogs);
    }

    const blogPostsContent = {
        featured: {
            category: "DIGITAL STRATEGY",
            title: "Why Boosting Facebook Posts Fails—And How Connected Websites + Meta Ads Win Customers",
            meta: "By Asad Khalid, Furqan & Zohaib · 4 min read",
            body: `
                <p>Many small and medium businesses in Pakistan spend thousands of rupees clicking the blue "Boost Post" button on Instagram or Facebook. While it brings likes and comments, it rarely brings consistent paying customers.</p>
                <h4>1. The Problem With Scattered Campaigns</h4>
                <p>When you boost a post without Meta Ads Manager, you miss out on conversion optimization, retargeting pixels, and custom lookalike audiences.</p>
                <h4>2. The ReachCraft Connected Strategy</h4>
                <p>At ReachCraft, we combine high-retention AI/Edited Video creatives with a fast landing page and direct WhatsApp lead routing.</p>
            `
        }
    };

    document.querySelectorAll('.open-blog-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-post');
            const post = blogPostsContent[key];
            if (post && blogModal) {
                document.getElementById('reader-category').textContent = post.category;
                document.getElementById('reader-title').textContent = post.title;
                document.getElementById('reader-meta').textContent = post.meta;
                document.getElementById('reader-content').innerHTML = post.body;
                blogModal.classList.add('active');
            }
        });
    });

    if (closeBlogModal && blogModal) {
        closeBlogModal.addEventListener('click', () => blogModal.classList.remove('active'));
        blogModal.addEventListener('click', (e) => {
            if (e.target === blogModal) blogModal.classList.remove('active');
        });
    }

    // ================= 6. FAQ ACCORDION LOGIC =================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        if (btn) {
            btn.addEventListener('click', () => {
                faqItems.forEach(other => {
                    if (other !== item) other.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        }
    });

    // ================= 7. CONTACT FORM SUBMISSION (MYSQL + DIRECT GMAIL SEND) =================
    const contactForm = document.getElementById('contact-quote-form');
    const contactAlert = document.getElementById('contact-alert');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending Inquiry...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

            const formData = {
                name: document.getElementById('client-name').value.trim(),
                phone: document.getElementById('client-phone').value.trim(),
                email: document.getElementById('client-email').value.trim(),
                service: document.getElementById('client-service').value,
                budget: document.getElementById('client-budget').value,
                message: document.getElementById('client-message').value.trim()
            };

            try {
                fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                }).catch(() => {});

                await fetch('https://formsubmit.co/ajax/reachcraft1@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        _subject: `🚀 New ReachCraft Inquiry: ${formData.service} from ${formData.name}`,
                        Client_Name: formData.name,
                        Phone_WhatsApp: formData.phone,
                        Client_Email: formData.email,
                        Service_Needed: formData.service,
                        Estimated_Budget: formData.budget,
                        Project_Details: formData.message,
                        _template: 'table'
                    })
                });

                contactAlert.className = 'form-alert success';
                contactAlert.innerHTML = '✅ <strong>Inquiry Sent!</strong> Saved in Database & emailed to <strong>reachcraft1@gmail.com</strong>.';
                contactAlert.style.display = 'block';
                contactForm.reset();
            } catch (err) {
                contactAlert.className = 'form-alert error';
                contactAlert.textContent = '⚠️ Something went wrong. Please message us on WhatsApp.';
                contactAlert.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Send Inquiry</span> <i class="fa-solid fa-paper-plane" style="margin-left:8px;"></i>';
            }
        });
    }

    // ================= 8. NEWSLETTER SUBSCRIPTION =================
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            const email = input.value.trim();
            if (!email) return;

            try {
                await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
            } catch (e) {}

            input.value = '';
            input.placeholder = '✔ Subscribed! Thank you.';
        });
    });

    // ================= 9. LIVE SYNC BLOGS, PROJECTS & SETTINGS WITH ADMIN PANEL =================
    const blogGridEl = document.getElementById('blog-grid');
    if (blogGridEl) {
        fetch('/api/blogs')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.blogs.length > 0) {
                    blogGridEl.innerHTML = data.blogs.map(b => `
                        <article class="blog-card" data-category="${b.category}">
                            <div class="blog-card-thumb">
                                <img src="${b.image_url}" alt="${b.title}">
                                <span class="blog-pill">${b.category_label}</span>
                            </div>
                            <div class="blog-card-body">
                                <div class="blog-date-row">
                                    <span><i class="fa-regular fa-user"></i> By ${b.author}</span>
                                    <span><i class="fa-regular fa-clock"></i> ${b.read_time}</span>
                                </div>
                                <h3 class="blog-card-title">${b.title}</h3>
                                <p class="blog-card-desc">${b.excerpt}</p>
                                <button class="blog-read-btn dynamic-blog-btn" data-id="${b.id}">
                                    Read Article <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </article>
                    `).join('');

                    document.querySelectorAll('.dynamic-blog-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const post = data.blogs.find(x => x.id == btn.getAttribute('data-id'));
                            if (post && blogModal) {
                                document.getElementById('reader-category').textContent = post.category_label;
                                document.getElementById('reader-title').textContent = post.title;
                                document.getElementById('reader-meta').textContent = `By ${post.author} · ${post.read_time}`;
                                document.getElementById('reader-content').innerHTML = post.content;
                                blogModal.classList.add('active');
                            }
                        });
                    });
                }
            }).catch(() => {});
    }

    const caseGridEl = document.getElementById('case-projects-grid');
    if (caseGridEl) {
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.projects.length > 0) {
                    caseGridEl.innerHTML = data.projects.map(p => {
                        const tagsHtml = p.tags.split(',').map(t => `<span>${t.trim()}</span>`).join('');
                        return `
                            <div class="case-card" data-category="${p.category}">
                                <div class="case-thumb">
                                    <img src="${p.image_url}" alt="${p.title}">
                                    <span class="case-category-pill">${p.category_label}</span>
                                </div>
                                <div class="case-body">
                                    <h3>${p.title}</h3>
                                    <p>${p.description}</p>
                                    <div class="case-tags">${tagsHtml}</div>
                                    <a href="https://wa.me/923106780072?text=Hi%20ReachCraft!%20I%20liked%20your%20project:%20${encodeURIComponent(p.title)}" target="_blank" class="case-link">
                                        Build Similar Project <i class="fa-solid fa-arrow-right"></i>
                                    </a>
                                </div>
                            </div>
                        `;
                    }).join('');
                }
            }).catch(() => {});
    }

    fetch('/api/settings')
        .then(res => res.json())
        .then(data => {
            if (data.success && data.settings) {
                const s = data.settings;
                const hoursEl = document.querySelector('.office-hours');
                if (hoursEl && s.office_hours) hoursEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${s.office_hours}`;

                const topMailEl = document.querySelector('.top-left a[href^="mailto:"]');
                if (topMailEl && s.email) {
                    topMailEl.href = `mailto:${s.email}`;
                    topMailEl.innerHTML = `<i class="fa-solid fa-envelope"></i> ${s.email}`;
                }
            }
        }).catch(() => {});

    // ================= 10. HOME PAGE "OUR WORK SPEAKS" SYNC + FAVICON + SCROLL REVEAL =================
    if (!document.querySelector('link[rel="icon"]')) {
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        favicon.href = 'assets/logo.png';
        document.head.appendChild(favicon);
    }

    const homePortfolioGrid = document.querySelector('.portfolio-section .portfolio-grid');
    if (homePortfolioGrid) {
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.projects.length > 0) {
                    const top3 = data.projects.slice(0, 3);
                    homePortfolioGrid.innerHTML = top3.map((p, i) => `
                        <div class="portfolio-item reveal-on-scroll revealed">
                            <div class="portfolio-thumb">
                                <img src="${p.image_url}" alt="${p.title}" class="portfolio-img">
                                <div class="mockup-overlay ${i === 1 ? 'blue-tint' : ''}">
                                    <span class="mockup-tag">${p.category_label}</span>
                                    <h4 class="mockup-heading">${p.title}</h4>
                                    <a href="portfolio.html" class="mockup-btn">View Project <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                                </div>
                            </div>
                            <h3 class="portfolio-title">${p.title}</h3>
                        </div>
                    `).join('');
                }
            }).catch(() => {});
    }

    const revealSelectors = '.service-card, .why-item, .portfolio-item, .founder-card, .process-card, .service-detail-block, .case-card, .story-breakdown-card, .blog-card, .featured-blog-card, .contact-info-panel, .contact-form-card, .faq-item';
    const elementsToReveal = document.querySelectorAll(revealSelectors);

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    elementsToReveal.forEach((el) => {
        el.classList.add('reveal-on-scroll');
        revealObserver.observe(el);
    });

    // ================= 11. FEATURE #1: INTERACTIVE CUSTOM PACKAGE BUILDER =================
    const ctaSectionEl = document.querySelector('.cta-section');
    const isHomeOrServices = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('services.html') || window.location.pathname === '/';

    if (ctaSectionEl && isHomeOrServices) {
        const builderSection = document.createElement('section');
        builderSection.className = 'package-builder-section';
        builderSection.id = 'package-builder';
        builderSection.innerHTML = `
            <div class="container">
                <div class="section-header">
                    <span class="reviews-badge">CUSTOM PACKAGE ESTIMATOR</span>
                    <h2 class="section-title">Build Your Custom Growth Package</h2>
                    <p class="section-subtitle">
                        Select the services your business needs below to create a tailored bundle and get an instant founder quote on WhatsApp.
                    </p>
                </div>

                <div class="builder-wrapper">
                    <div class="builder-options-grid" id="pkg-options-grid">
                        <div class="pkg-option-card selected" data-title="Custom Business Website" data-days="5-7 Days">
                            <div class="pkg-check-box"><i class="fa-solid fa-check"></i></div>
                            <div class="pkg-info">
                                <h4>Custom Business Website</h4>
                                <p>Responsive design, fast load speed, SEO setup & WhatsApp lead integration.</p>
                                <span class="pkg-tag-meta"><i class="fa-regular fa-clock"></i> Est. 5–7 Days</span>
                            </div>
                        </div>

                        <div class="pkg-option-card" data-title="Custom Software / POS / CRM" data-days="2-3 Weeks">
                            <div class="pkg-check-box"><i class="fa-solid fa-check"></i></div>
                            <div class="pkg-info">
                                <h4>Custom Software / POS / CRM</h4>
                                <p>Tailored Node.js & SQL software for billing, inventory & business automation.</p>
                                <span class="pkg-tag-meta"><i class="fa-regular fa-clock"></i> Est. 2–3 Weeks</span>
                            </div>
                        </div>

                        <div class="pkg-option-card selected" data-title="Meta Ads Campaign Setup & Scaling" data-days="3-5 Days Setup">
                            <div class="pkg-check-box"><i class="fa-solid fa-check"></i></div>
                            <div class="pkg-info">
                                <h4>Meta Ads & Lead Generation</h4>
                                <p>Laser-targeted Facebook & Instagram ads driving direct WhatsApp inquiries.</p>
                                <span class="pkg-tag-meta"><i class="fa-solid fa-fire"></i> High ROI</span>
                            </div>
                        </div>

                        <div class="pkg-option-card" data-title="Social Media Management (Monthly)" data-days="Ongoing Monthly">
                            <div class="pkg-check-box"><i class="fa-solid fa-check"></i></div>
                            <div class="pkg-info">
                                <h4>Social Media Management</h4>
                                <p>Complete content calendar, branded posts, reels & profile optimization.</p>
                                <span class="pkg-tag-meta"><i class="fa-regular fa-calendar"></i> Monthly Growth</span>
                            </div>
                        </div>

                        <div class="pkg-option-card" data-title="AI Video Commercials & Pro Reels" data-days="3-4 Days">
                            <div class="pkg-check-box"><i class="fa-solid fa-check"></i></div>
                            <div class="pkg-info">
                                <h4>AI Video Ads & Pro Editing</h4>
                                <p>Scroll-stopping AI product videos, dynamic captions & high-retention Reels.</p>
                                <span class="pkg-tag-meta"><i class="fa-solid fa-wand-magic-sparkles"></i> Viral Creatives</span>
                            </div>
                        </div>

                        <div class="pkg-option-card" data-title="Logo Design & Complete Brand Kit" data-days="3-4 Days">
                            <div class="pkg-check-box"><i class="fa-solid fa-check"></i></div>
                            <div class="pkg-info">
                                <h4>Logo & Complete Brand Kit</h4>
                                <p>Modern vector logo, color palette, typography & social media templates.</p>
                                <span class="pkg-tag-meta"><i class="fa-solid fa-pen-nib"></i> Brand Identity</span>
                            </div>
                        </div>
                    </div>

                    <div class="builder-summary-card">
                        <h3>Your Custom Bundle</h3>
                        <p class="summary-sub">Selected services for your project:</p>
                        <div class="selected-items-list" id="pkg-selected-list"></div>

                        <div class="summary-stats-box">
                            <div>
                                <span>Selected Services</span>
                                <strong id="pkg-total-count">2 Services</strong>
                            </div>
                            <div style="text-align:right;">
                                <span>Bundle Discount</span>
                                <strong style="color:#4ADE80;" id="pkg-discount-badge">Eligible (10% OFF)</strong>
                            </div>
                        </div>

                        <button class="btn-send-pkg" id="send-pkg-wa">
                            <i class="fa-brands fa-whatsapp" style="font-size:18px;"></i> Get Instant Quote for This Bundle
                        </button>
                    </div>
                </div>
            </div>
        `;
        ctaSectionEl.parentNode.insertBefore(builderSection, ctaSectionEl);

        const pkgCards = builderSection.querySelectorAll('.pkg-option-card');
        const selectedListEl = document.getElementById('pkg-selected-list');
        const totalCountEl = document.getElementById('pkg-total-count');
        const discountBadgeEl = document.getElementById('pkg-discount-badge');
        const sendPkgBtn = document.getElementById('send-pkg-wa');

        function updatePackageSummary() {
            const activeCards = Array.from(pkgCards).filter(c => c.classList.contains('selected'));
            if (activeCards.length === 0) {
                selectedListEl.innerHTML = `<p style="font-size:13px; color:#94A3B8;">Click on any service card on the left to add it to your bundle.</p>`;
            } else {
                selectedListEl.innerHTML = activeCards.map(c => `
                    <div class="selected-pill-row">
                        <span><i class="fa-solid fa-circle-check"></i> ${c.getAttribute('data-title')}</span>
                        <small style="color:#93C5FD;">${c.getAttribute('data-days')}</small>
                    </div>
                `).join('');
            }

            totalCountEl.textContent = `${activeCards.length} Service${activeCards.length === 1 ? '' : 's'}`;
            discountBadgeEl.textContent = activeCards.length >= 2 ? 'Bundle Offer (15% OFF)' : 'Standard Rate';
        }

        pkgCards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('selected');
                updatePackageSummary();
            });
        });

        sendPkgBtn.addEventListener('click', () => {
            const activeCards = Array.from(pkgCards).filter(c => c.classList.contains('selected'));
            if (activeCards.length === 0) {
                alert('Please select at least 1 service to build your package!');
                return;
            }
            const servicesList = activeCards.map((c, i) => `${i + 1}. ${c.getAttribute('data-title')}`).join('\n');
            const waMsg = encodeURIComponent(`Hi ReachCraft Founders! \n\nI built a custom package on your website:\n${servicesList}\n\nPlease share the estimated quote and timeline!`);
            window.open(`https://wa.me/923106780072?text=${waMsg}`, '_blank');
        });

        updatePackageSummary();
    }

    // ================= 12. FEATURE #2: SMART REACHCRAFT AI ASSISTANT CHATBOT =================
    const chatWidgetHTML = `
        <button class="rc-chatbot-launcher" id="rc-chat-launcher" aria-label="Open AI Assistant">
            <span class="bot-pulse"></span>
            <i class="fa-solid fa-robot"></i>
            <span>Ask ReachCraft AI</span>
        </button>

        <div class="rc-chat-window" id="rc-chat-window">
            <div class="rc-chat-header">
                <div class="rc-chat-header-info">
                    <div class="rc-bot-avatar"><i class="fa-solid fa-robot"></i></div>
                    <div>
                        <h4>ReachCraft Assistant</h4>
                        <span>Online · Powered by ReachCraft Team</span>
                    </div>
                </div>
                <button class="rc-chat-close" id="rc-chat-close"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <div class="rc-chat-messages" id="rc-chat-messages">
                <div class="chat-bubble bot">
                    Assalam-o-Alaikum! Welcome to <strong>ReachCraft</strong>. How can we help grow your business today?
                </div>
            </div>

            <div class="rc-quick-chips">
                <button class="rc-chip" data-ask="What services do you offer?">Our Services</button>
                <button class="rc-chip" data-ask="How much does a website cost?">Website Pricing</button>
                <button class="rc-chip" data-ask="Tell me about Meta Ads & AI Videos">Meta Ads & AI Video</button>
                <button class="rc-chip" data-ask="Who are the founders?">Meet Founders</button>
            </div>

            <form class="rc-chat-input-area" id="rc-chat-form">
                <input type="text" id="rc-chat-input" placeholder="Ask about websites, software, ads..." required>
                <button type="submit"><i class="fa-solid fa-paper-plane"></i></button>
            </form>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatWidgetHTML);

    const chatLauncher = document.getElementById('rc-chat-launcher');
    const chatWindow = document.getElementById('rc-chat-window');
    const chatClose = document.getElementById('rc-chat-close');
    const chatMessages = document.getElementById('rc-chat-messages');
    const chatForm = document.getElementById('rc-chat-form');
    const chatInput = document.getElementById('rc-chat-input');

    chatLauncher.addEventListener('click', () => chatWindow.classList.toggle('open'));
    chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));

    function addChatMessage(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}`;
        bubble.innerHTML = text;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotReply(query) {
        const q = query.toLowerCase();
        if (q.includes('service') || q.includes('offer') || q.includes('what do you')) {
            return `We offer complete digital solutions under one roof:<br>1. <strong>Custom Websites & E-Commerce</strong><br>2. <strong>Custom Software (CRM/POS) & Apps</strong><br>3. <strong>Meta Ads & Social Media</strong><br>4. <strong>AI Video Ads, Pro Editing & Logo Design</strong>`;
        }
        if (q.includes('price') || q.includes('cost') || q.includes('budget') || q.includes('website')) {
            return `We tailor every quote to your exact business needs! A professional business website takes <strong>5–7 days</strong>. Would you like a quick quote on WhatsApp? <br><a href="https://wa.me/923106780072" target="_blank" style="color:#2F6BFF; font-weight:700;">👉 Click to Chat on WhatsApp (0310 6780072)</a>`;
        }
        if (q.includes('meta') || q.includes('ad') || q.includes('video') || q.includes('ai')) {
            return `Instead of boosting random posts, we create <strong>scroll-stopping AI Videos & edited Reels</strong> and run targeted campaigns in <strong>Meta Ads Manager</strong> to bring daily buyers directly to your WhatsApp!`;
        }
        if (q.includes('founder') || q.includes('team') || q.includes('who') || q.includes('asad') || q.includes('furqan') || q.includes('zohaib')) {
            return `ReachCraft is run by three friends:<br>• <strong>Asad Khalid</strong> (Founder & Lead Developer)<br>• <strong>Furqan</strong> (Co-Founder & Growth Lead)<br>• <strong>Zohaib</strong> (Co-Founder & Creative Director)<br>You work directly with us!`;
        }
        return `Great question! Our founders <strong>Asad, Furqan & Zohaib</strong> can guide you personally on this. Call or WhatsApp us at <strong>0310 6780072</strong> or <a href="contact.html" style="color:#2F6BFF; font-weight:700;">fill out our quote form</a>!`;
    }

    document.querySelectorAll('.rc-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const question = chip.getAttribute('data-ask');
            addChatMessage(question, 'user');
            setTimeout(() => addChatMessage(getBotReply(question), 'bot'), 350);
        });
    });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        addChatMessage(text, 'user');
        chatInput.value = '';
        setTimeout(() => addChatMessage(getBotReply(text), 'bot'), 400);
    });

});