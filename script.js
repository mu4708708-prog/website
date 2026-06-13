/**
 * Electrical Engineer Portfolio JS
 * Completing website features and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize All Sub-systems
    initElectricalBackground();
    initNavbarScrollSpy();
    initTimelineToggle();
    initSkillsAnimation();
    initProjectFilters();
    initModals();
    initAuthPortal();
    initContactForm();
    initLiveSearch();
    initSmoothScroll();
});

/* ==========================================================================
   1. Ambient Electrical Node Canvas Background
   ========================================================================== */
function initElectricalBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'electrical-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.35';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class simulating electrical nodes
    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1.5;
            this.glow = Math.random() * 10 + 5;
            // Electrical pulse phase
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.02 + Math.random() * 0.03;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.pulsePhase += this.pulseSpeed;

            // Boundary checks
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            const glowIntensity = Math.sin(this.pulsePhase) * 0.5 + 0.5;
            ctx.arc(this.x, this.y, this.radius + glowIntensity * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 159, 67, ${0.4 + glowIntensity * 0.6})`;
            ctx.shadowColor = '#ff9f43';
            ctx.shadowBlur = this.glow * glowIntensity;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow blur for performance
        }
    }

    const nodesCount = Math.min(60, Math.floor((width * height) / 20000));
    const nodes = [];
    for (let i = 0; i < nodesCount; i++) {
        nodes.push(new Node());
    }

    // Capture mouse coordinate (can be passed via wrapper interaction)
    let mouse = { x: null, y: null, maxDist: 180 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw and update nodes
        nodes.forEach((node) => {
            node.update();
            node.draw();
        });

        // Draw electrical grid lines
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130) {
                    const alpha = (1 - dist / 130) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(255, 159, 67, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Connection to mouse position
            if (mouse.x !== null && mouse.y !== null) {
                const dx = nodes[i].x - mouse.x;
                const dy = nodes[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.maxDist) {
                    const alpha = (1 - dist / mouse.maxDist) * 0.4;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`; // Spark line
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   2. Scroll Spy and Sticky Navbar
   ========================================================================== */
function initNavbarScrollSpy() {
    const header = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section, .main');
    const navLinks = document.querySelectorAll('.menu ul li a');

    // Add overlay scroll check to main wrap
    window.addEventListener('scroll', () => {
        // Sticky Header Blur
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Scroll Spy
        let currentSectionId = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id') || '';
            }
        });

        // Handle case for top home page check if no id
        if (window.scrollY < 200) {
            currentSectionId = 'home';
        }

        navLinks.forEach((link) => {
            link.classList.remove('active');
            const hrefVal = link.getAttribute('href');
            if (hrefVal === '#' && currentSectionId === 'home') {
                link.classList.add('active');
            } else if (hrefVal === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   3. Education vs Experience Timeline Toggle
   ========================================================================== */
function initTimelineToggle() {
    const buttons = document.querySelectorAll('.timeline-btn');
    const containers = document.querySelectorAll('.timeline-content');

    if (!buttons.length) return;

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            buttons.forEach((b) => b.classList.remove('active'));
            containers.forEach((c) => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            const targetContainer = document.getElementById(targetId);
            if (targetContainer) {
                targetContainer.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   4. Skills Circle and Bar Animation
   ========================================================================== */
function initSkillsAnimation() {
    const progressBars = document.querySelectorAll('.progress-line span');
    const circleProgress = document.querySelectorAll('.circle-progress');

    const observerOptions = {
        threshold: 0.25,
    };

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;

                // Animate horizontal progress bars
                if (element.classList.contains('progress-line-fill')) {
                    const value = element.getAttribute('data-value');
                    element.style.width = value + '%';
                }

                // Animate circular progress bars
                if (element.classList.contains('circle-progress')) {
                    const percent = element.getAttribute('data-percent');
                    const circle = element.querySelector('circle.progress');
                    if (circle) {
                        const radius = circle.r.baseVal.value;
                        const circumference = 2 * Math.PI * radius;
                        const offset = circumference - (percent / 100) * circumference;
                        
                        circle.style.strokeDasharray = `${circumference} ${circumference}`;
                        circle.style.strokeDashoffset = circumference;
                        
                        // Small timeout to trigger transition
                        setTimeout(() => {
                            circle.style.strokeDashoffset = offset;
                        }, 50);
                    }
                }
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    progressBars.forEach((bar) => {
        bar.classList.add('progress-line-fill');
        skillsObserver.observe(bar);
    });

    circleProgress.forEach((circle) => {
        skillsObserver.observe(circle);
    });
}

/* ==========================================================================
   5. Dynamic Project Filter
   ========================================================================== */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length) return;

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach((card) => {
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
                
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.transform = 'scale(1)';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 250);
            });
        });
    });
}

/* ==========================================================================
   6. Modals for Detail Inspection (Projects & Certifications)
   ========================================================================== */
function initModals() {
    const projectTriggers = document.querySelectorAll('.project-card .view-details');
    const certTriggers = document.querySelectorAll('.cert-card');
    const modal = document.getElementById('details-modal');
    const modalBody = document.getElementById('modal-details-body');
    const closeBtn = document.querySelector('.modal-close');

    if (!modal || !closeBtn) return;

    // Project Details Data
    const projectDetails = {
        p1: {
            title: 'Intelligent Fault-Tolerant Sensor Assembly (IFTSA)',
            img: 'image.jpg',
            category: 'Final Year Project',
            desc: 'Designed and implemented a smart sensor system that detects, isolates, and compensates for sensor faults in real-time. Applied machine learning models to improve sensor assembly accuracy and system robustness. Optimized specifically for industrial and automotive applications to enhance safety and minimize system downtime.',
            spec: ['Project Duration: Aug 2025 - Jun 2026', 'Hardware: Redundant sensor arrays & microcontroller', 'Algorithm: Machine learning fault detection & isolation', 'Software/Tools: Jupyter Notebook, MATLAB, Proteus']
        },
        p2: {
            title: 'IoT Water Level Monitor',
            img: 'image.jpg',
            category: 'Semester Project',
            desc: 'Developed a remote IoT water level tracking system using an ESP32 microcontroller and an ultrasonic sensor. Measures and transmits real-time fluid depth data to an online dashboard interface over WiFi for remote monitoring.',
            spec: ['Microcontroller: ESP32', 'Sensor: HC-SR04 Ultrasonic sensor', 'Protocol: WiFi / MQTT communication', 'Software: Arduino IDE']
        },
        p3: {
            title: 'DC-DC Boost Converter with Microcontroller',
            img: 'image.jpg',
            category: 'Semester Project',
            desc: 'Designed a high-efficiency DC-DC boost converter powered by a microcontroller-driven feedback loop. Simulated and prototyped the circuit in Proteus/Multisim to regulate and step up input voltages dynamically under different electrical loads.',
            spec: ['Feedback Control: Microcontroller PWM logic', 'Simulation: Proteus, Multisim, MATLAB', 'Main Category: Power Electronics', 'Core Skills: Analog circuits, feedback loops']
        },
        p4: {
            title: 'Traffic Light Control System using PLC and HMI',
            img: 'image.jpg',
            category: 'Semester Project',
            desc: 'Developed an automated multi-way traffic junction light controller utilizing PLC ladder logic and HMI display design. Designed and simulated the control sequences in Siemens TIA Portal to ensure safe junction phase timing and transition controls.',
            spec: ['Software: Siemens TIA Portal', 'Control Logic: PLC Ladder diagrams', 'Interface: Custom HMI screen design', 'Application: Industrial automation / SCADA / HMI']
        }
    };

    projectTriggers.forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const id = trigger.getAttribute('data-project-id');
            const data = projectDetails[id];
            
            if (data) {
                let specListHtml = data.spec.map(s => `<li><ion-icon name="checkmark-circle-outline"></ion-icon> ${s}</li>`).join('');
                modalBody.innerHTML = `
                    <div class="modal-grid">
                        <div class="modal-img-wrap">
                            <img src="${data.img}" alt="${data.title}">
                        </div>
                        <div class="modal-info-wrap">
                            <span class="modal-tag">${data.category}</span>
                            <h3>${data.title}</h3>
                            <p>${data.desc}</p>
                            <h4>Technical Specifications:</h4>
                            <ul>
                                ${specListHtml}
                            </ul>
                        </div>
                    </div>
                `;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    certTriggers.forEach((cert) => {
        cert.addEventListener('click', () => {
            const title = cert.querySelector('.cert-info h3').innerText;
            const issuer = cert.querySelector('.cert-info p').innerText;
            
            modalBody.innerHTML = `
                <div class="modal-cert-view">
                    <div class="cert-mock-badge">
                        <ion-icon name="ribbon-outline"></ion-icon>
                    </div>
                    <h3>${title}</h3>
                    <p class="issuer-text">${issuer}</p>
                    <div class="cert-verify-status">
                        <ion-icon name="shield-checkmark"></ion-icon> Verified Credentials
                    </div>
                    <p class="cert-description">This certification qualifies structural expertise in modern engineering technologies. Credential verification is simulated using digital cryptographic signoffs.</p>
                </div>
            `;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close Modal event
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
}

/* ==========================================================================
   7. Authentication Simulation: Login & Client Portal Dashboard
   ========================================================================== */
function initAuthPortal() {
    const loginCard = document.querySelector('.login-card');
    const authBtn = loginCard ? loginCard.querySelector('.btnn') : null;
    const toggleLink = loginCard ? loginCard.querySelector('.link a') : null;
    const cardTitle = loginCard ? loginCard.querySelector('h2') : null;
    
    if (!loginCard || !authBtn || !toggleLink) return;

    let isSignUpMode = false;

    // Toggle between Sign Up and Login Form Fields dynamically
    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        isSignUpMode = !isSignUpMode;
        
        const formInputs = loginCard.querySelector('.form-inputs');
        const descText = loginCard.querySelector('.link');
        
        if (isSignUpMode) {
            cardTitle.innerText = "Register Client";
            // Insert Full Name input
            const nameInputHtml = `
                <div class="input-group extra-field" style="display: none;">
                    <input type="text" required placeholder="Enter Full Name Here" id="reg-name">
                </div>
            `;
            formInputs.insertAdjacentHTML('afterbegin', nameInputHtml);
            const extra = formInputs.querySelector('.extra-field');
            // Animate entrance
            setTimeout(() => {
                extra.style.display = 'block';
            }, 10);
            
            authBtn.innerText = "Sign Up";
            descText.innerHTML = `Already have an account?<br><a href="#">Login here</a>`;
        } else {
            cardTitle.innerText = "Login Here";
            const extra = formInputs.querySelector('.extra-field');
            if (extra) extra.remove();
            
            authBtn.innerText = "Login";
            descText.innerHTML = `Don't have an account?<br><a href="#">Sign up here</a>`;
        }

        // Re-attach toggle listener since content refreshed
        const newToggleLink = loginCard.querySelector('.link a');
        newToggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleLink.click();
        });
    });

    // Simulated Authentication & transition to dashboard portal
    authBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        const inputs = loginCard.querySelectorAll('input[required]');
        let allValid = true;
        inputs.forEach(input => {
            if(!input.value || !input.checkValidity()){
                input.style.borderColor = 'red';
                allValid = false;
            } else {
                input.style.borderColor = '';
            }
        });

        if (!allValid) return;

        // Get values
        const email = loginCard.querySelector('input[type="email"]').value;
        const nameVal = isSignUpMode ? (document.getElementById('reg-name')?.value || "Client Partner") : email.split('@')[0];

        // Animate Login Card exiting/loading state
        loginCard.style.transform = 'scale(0.95)';
        loginCard.style.opacity = '0.5';
        authBtn.innerText = "Verifying...";
        authBtn.disabled = true;

        setTimeout(() => {
            // Load Mock Dashboard UI
            loginCard.innerHTML = `
                <div class="dashboard-portal">
                    <div class="portal-header">
                        <div class="avatar-icon">
                            <ion-icon name="person-circle-sharp"></ion-icon>
                        </div>
                        <h3>Welcome Back</h3>
                        <p class="client-name">${nameVal}</p>
                        <span class="portal-badge">Authorized Client</span>
                    </div>
                    
                    <div class="portal-resources">
                        <h4>Secure Shared Files</h4>
                        <ul class="file-list">
                            <li>
                                <span class="file-info">
                                    <ion-icon name="document-text-outline" class="file-icon"></ion-icon>
                                    <span class="file-meta">
                                        <span class="file-name">Uzair_Electrical_Resume.pdf</span>
                                        <span class="file-size">1.2 MB</span>
                                    </span>
                                </span>
                                <a href="#" class="file-down-btn" title="Download"><ion-icon name="download-outline"></ion-icon></a>
                            </li>
                            <li>
                                <span class="file-info">
                                    <ion-icon name="code-working-outline" class="file-icon"></ion-icon>
                                    <span class="file-meta">
                                        <span class="file-name">IFTSA_Final_Project_Report.pdf</span>
                                        <span class="file-size">3.4 MB</span>
                                    </span>
                                </span>
                                <a href="#" class="file-down-btn" title="Download"><ion-icon name="download-outline"></ion-icon></a>
                            </li>
                            <li>
                                <span class="file-info">
                                    <ion-icon name="analytics-outline" class="file-icon"></ion-icon>
                                    <span class="file-meta">
                                        <span class="file-name">IoT_Water_Level_Monitor_Schematics.pdf</span>
                                        <span class="file-size">1.8 MB</span>
                                    </span>
                                </span>
                                <a href="#" class="file-down-btn" title="Download"><ion-icon name="download-outline"></ion-icon></a>
                            </li>
                        </ul>
                    </div>

                    <button class="logout-btn"><ion-icon name="log-out-outline"></ion-icon> Log Out</button>
                </div>
            `;
            
            // Re-apply style animations
            loginCard.style.transform = 'scale(1)';
            loginCard.style.opacity = '1';
            
            // Setup logout handler
            const logoutBtn = loginCard.querySelector('.logout-btn');
            logoutBtn.addEventListener('click', () => {
                // Refresh Page state to logout cleanly
                window.location.reload();
            });

            // Prevent mock file download anchors from reloading
            const downloadBtns = loginCard.querySelectorAll('.file-down-btn');
            downloadBtns.forEach(btn => {
                btn.addEventListener('click', (ev) => {
                    ev.preventDefault();
                    alert("Downloaded File: " + btn.parentElement.querySelector('.file-name').innerText);
                });
            });

        }, 1200);
    });
}

/* ==========================================================================
   8. Contact Form with EmailJS Integration
   ========================================================================== */
function initContactForm() {
    // Initialize EmailJS with Public Key
    emailjs.init('gGj7hvgfjovBvq3pC');

    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    const inputs = contactForm.querySelectorAll('input, textarea');

    inputs.forEach((input) => {
        input.addEventListener('input', () => {
            validateField(input);
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let allValid = true;
        inputs.forEach((input) => {
            if (!validateField(input)) {
                allValid = false;
            }
        });

        if (allValid) {
            const submitBtn = contactForm.querySelector('.form-submit-btn');
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            // Collect form values - matching EmailJS template variables exactly
            const templateParams = {
                name:    document.getElementById('contact-name').value.trim(),
                email:   document.getElementById('contact-email').value.trim(),
                title:   document.getElementById('contact-subject').value.trim(),
                message: document.getElementById('contact-message').value.trim(),
            };

            // Send via EmailJS
            emailjs.send('service_ujmbe9l', 'template_6ciyx9j', templateParams)
                .then(() => {
                    // Success — show confirmation message
                    const successDiv = document.createElement('div');
                    successDiv.className = 'contact-success-msg';
                    successDiv.innerHTML = `
                        <ion-icon name="checkmark-circle"></ion-icon>
                        <p>Message Sent Successfully! I will get back to you shortly.</p>
                    `;
                    contactForm.innerHTML = '';
                    contactForm.appendChild(successDiv);
                })
                .catch((error) => {
                    // Failure — show error and re-enable button
                    console.error('EmailJS Error:', error);
                    submitBtn.innerText = 'Send Message';
                    submitBtn.disabled = false;

                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'contact-error-msg';
                    errorDiv.innerHTML = `
                        <ion-icon name="close-circle"></ion-icon>
                        <p>Oops! Something went wrong. Please try again or email me directly at <a href="mailto:mu4708708@gmail.com">mu4708708@gmail.com</a></p>
                    `;
                    // Insert error above button
                    const existingError = contactForm.querySelector('.contact-error-msg');
                    if (existingError) existingError.remove();
                    submitBtn.insertAdjacentElement('beforebegin', errorDiv);
                });
        }
    });

    function validateField(field) {
        const parent = field.parentElement;
        let valid = true;

        if (field.required && !field.value.trim()) {
            valid = false;
        } else if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            valid = emailRegex.test(field.value);
        }

        if (!valid) {
            parent.classList.add('invalid');
            parent.classList.remove('valid');
        } else {
            parent.classList.remove('invalid');
            parent.classList.add('valid');
        }

        return valid;
    }
}

/* ==========================================================================
   9. Live Search Engine
   ========================================================================== */
function initLiveSearch() {
    const searchInput = document.querySelector('.srch');
    const searchBtn = document.querySelector('.search .btn');

    if (!searchInput) return;

    // We search across Project cards, Skill elements, and Service cards
    const searchables = [
        { 
            elements: document.querySelectorAll('.project-card'), 
            textSelector: '.project-info h3, .project-info p, .project-tag' 
        },
        { 
            elements: document.querySelectorAll('.circle-skill, .skill-bar'), 
            textSelector: 'span, .skill-info span' 
        },
        { 
            elements: document.querySelectorAll('.service-card'), 
            textSelector: 'h3, p' 
        }
    ];

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();

        if (query === '') {
            // Reset highlighting & display
            searchables.forEach(group => {
                group.elements.forEach(el => {
                    el.style.opacity = '1';
                    el.style.transform = 'scale(1)';
                    el.style.boxShadow = '';
                    // Clean up highlights in specific text elements
                    const textNodes = el.querySelectorAll(group.textSelector);
                    if (textNodes.length > 0) {
                        textNodes.forEach(node => removeHighlights(node));
                    } else {
                        removeHighlights(el);
                    }
                });
            });
            return;
        }

        searchables.forEach(group => {
            group.elements.forEach(el => {
                const textNodes = el.querySelectorAll(group.textSelector);
                let content = '';
                
                textNodes.forEach(node => {
                    content += ' ' + node.innerText.toLowerCase();
                });

                // Fallback to card's inner text if no selectors matched
                if (textNodes.length === 0) {
                    content = el.innerText.toLowerCase();
                }

                if (content.includes(query)) {
                    el.style.opacity = '1';
                    el.style.transform = 'scale(1.02)';
                    el.style.boxShadow = '0 0 15px rgba(255, 159, 67, 0.4)';
                    
                    // Highlight ONLY inside leaf text nodes to protect parent event listeners (modal buttons, SVGs)
                    textNodes.forEach(node => {
                        highlightText(node, query);
                    });
                } else {
                    el.style.opacity = '0.4';
                    el.style.transform = 'scale(0.96)';
                    el.style.boxShadow = '';
                    
                    textNodes.forEach(node => {
                        removeHighlights(node);
                    });
                }
            });
        });
    }

    searchInput.addEventListener('input', performSearch);
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            performSearch();
        });
    }

    function highlightText(element, query) {
        removeHighlights(element);
        const innerHTML = element.innerHTML;
        // Escape query regex chars
        const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        
        // Match only plain text, not html tags
        const newHTML = innerHTML.replace(/(?![^<]*>)([^<]+)/g, (match) => {
            return match.replace(regex, '<mark class="search-highlight">$1</mark>');
        });
        element.innerHTML = newHTML;
    }

    function removeHighlights(element) {
        const highlights = element.querySelectorAll('mark.search-highlight');
        highlights.forEach(h => {
            const parent = h.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(h.innerText), h);
                parent.normalize();
            }
        });
    }
}

/* ==========================================================================
   10. Smooth Scrolling Navigation Anchor Links
   ========================================================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('.menu ul li a, .content .cn');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Only smooth scroll for internal anchors
            if (href.startsWith('#')) {
                e.preventDefault();
                
                if (href === '#') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    const targetEl = document.querySelector(href);
                    if (targetEl) {
                        const offsetPosition = targetEl.offsetTop - 80;
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });
}
