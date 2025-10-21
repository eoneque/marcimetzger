document.addEventListener('DOMContentLoaded', () => {
    // Basic interaction handlers
    const menuIcon = document.querySelector('.menu-icon');
    const ctaButton = document.querySelector('.cta-button');

    menuIcon.addEventListener('click', () => {
        console.log('Menu icon clicked!');
    });

    ctaButton.addEventListener('click', () => {
        console.log('CALL NOW button clicked!');
    });

    // ----------------------------------------------------
    // 1. GLOBAL SCROLL REVEAL OBSERVER 
    // ----------------------------------------------------

    const observerElements = document.querySelectorAll('.hidden:not(.service-item)');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const target = entry.target;
            
            if (entry.isIntersecting) {
                target.classList.add('show');
            } else {
                if (target.classList.contains('show')) {
                    target.classList.remove('show');
                }
            }
        });
    }, {
        rootMargin: '0px', 
        threshold: 0.0 
    });

    observerElements.forEach(element => {
        observer.observe(element);
    });

    const heroContent = document.querySelector('.hero-content.hidden');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('show');
            heroContent.classList.remove('hidden'); 
        }, 100);
    }


    // ----------------------------------------------------
    // 2. STAGGERED SERVICES OBSERVER 
    // ----------------------------------------------------

    const serviceListContainer = document.querySelector('.services-list-column');

    if (serviceListContainer) {
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const container = entry.target;
                const staggeredItems = container.querySelectorAll('.service-item');
                
                if (entry.isIntersecting) {
                    staggeredItems.forEach(item => {
                        item.classList.add('hidden'); 
                        item.classList.add('show');
                        
                        setTimeout(() => {
                            item.classList.remove('hidden');
                        }, 50); 
                    });

                } else {
                    staggeredItems.forEach(item => {
                        if (item.classList.contains('show')) {
                            item.classList.remove('show');
                            item.classList.add('hidden'); 
                        }
                    });
                }
            });
        }, {
            threshold: 0.0 
        });

        staggerObserver.observe(serviceListContainer);
    }


    // ====================================================
    // 3. STATS CAROUSEL LOGIC (Includes Background Image Change)
    // ====================================================
    
    const statsColumn = document.querySelector('.stats-column');
    const slides = document.querySelectorAll('.stat-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlideIndex = 0;
    let carouselInterval;

    const backgroundImages = [
        'images/realestate1.png', 
        'images/realestate2.png', 
        'images/realestate3.png'  
    ];

    if (slides.length > 0 && statsColumn && backgroundImages.length === slides.length) {
        
        // Modified to accept a direction parameter
        function showSlide(index, direction) { 
            // 🚨 CHANGE: Use the explicit direction passed in, or calculate it based on index
            const isGoingForward = (direction === 'forward');
            
            // 1. Animate out the old slide (text content)
            const oldSlide = document.querySelector('.stat-slide.active-slide');
            const oldDot = document.querySelector('.dot.active-dot');
            
            if (oldSlide) {
                // If sliding backward, you might want the old slide to slide right (out)
                // For simplicity with your current CSS, we rely on the CSS transition for fade/move.
                oldSlide.classList.remove('active-slide'); 
            }
            if (oldDot) {
                oldDot.classList.remove('active-dot');
            }

            // 2. Prepare the background for the slide-in effect
            // Set the background-position to the "start" of the slide for the *new* image
            // Note: Use a ternary to select the starting position based on direction
            statsColumn.style.backgroundPosition = isGoingForward ? '55% center' : '45% center';
            
            // Now, change the image itself (CSS transition will make it fade)
            statsColumn.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${backgroundImages[index]}')`;
            
            // Use a short delay before animating to the final background position
            setTimeout(() => {
                // Now animate it to the center (triggering the CSS transition)
                statsColumn.style.backgroundPosition = 'center center'; 
            }, 50); 

            // 3. Animate in the new slide (text content) and activate dot
            setTimeout(() => {
                slides[index].classList.add('active-slide');
                dots[index].classList.add('active-dot');
            }, 200);

            // 4. Update the current index at the end
            currentSlideIndex = index; 
        }

        function nextSlide() {
            let newIndex = (currentSlideIndex + 1) % slides.length;
            // When auto-advancing, we are always moving 'forward'
            showSlide(newIndex, 'forward'); 
        }
        
        function startCarousel() {
            clearInterval(carouselInterval); 
            carouselInterval = setInterval(nextSlide, 5000); 
        }

        // 🚨 CORRECTED Click handlers for dots
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                
                // Determine direction based on the current index vs the clicked index
                // This logic is crucial for the slide animation direction
                const direction = (index > currentSlideIndex || (index === 0 && currentSlideIndex === slides.length - 1)) ? 'forward' : 'backward';

                showSlide(index, direction); // Pass the calculated direction
                startCarousel(); 
            });
        });

        // Initialize carousel on load
        showSlide(0, 'forward'); // Start at 0, moving forward directionally
        startCarousel(); 
    } else {
        console.error('Stats carousel initialization failed. Check element selectors or image array length.');
    }

    console.log('JavaScript file loaded successfully, including all animation and carousel logic.');

    // ====================================================
    // 4. PHOTO GALLERY SLIDER & BACKGROUND CHANGER
    // ====================================================

    const galleryViewer = document.getElementById('mainGalleryViewer');
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryViewer && galleryContainer && galleryItems.length > 0) {
        
        let galleryInterval;
        let currentIndex = 0;
        const intervalTime = 10000; // 10 seconds

        // Array of full image paths for the viewer (should match the thumbnail order)
        const viewerImages = Array.from(galleryItems).map(item => item.querySelector('.gallery-image').src);

        // Function to update the main viewer background
        function updateGallery(index) {
            if (index < 0 || index >= viewerImages.length) {
                index = 0; // Loop back to start
            }
            
            // 1. Update background image (will fade/transition via CSS)
            galleryViewer.style.backgroundImage = `url('${viewerImages[index]}')`;
            
            // 2. Update active thumbnail class
            galleryItems.forEach(item => item.classList.remove('active'));
            galleryItems[index].classList.add('active');
            
            // 3. Auto-scroll the container to keep the active thumbnail in view (optional but good UX)
            const itemWidth = galleryItems[index].offsetWidth;
            const scrollPos = itemWidth * index - (galleryContainer.offsetWidth / 2) + (itemWidth / 2);
            galleryContainer.scrollTo({
                left: scrollPos,
                behavior: 'smooth'
            });
            
            currentIndex = index;
        }

        // Function to auto-advance the slider
        function autoAdvance() {
            updateGallery((currentIndex + 1) % viewerImages.length);
        }

        // Start the carousel timer
        function startGallerySlider() {
            clearInterval(galleryInterval); 
            galleryInterval = setInterval(autoAdvance, intervalTime);
        }

        // --- Event Listeners ---
        
        // Handle thumbnail clicks
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Manually update the viewer
                updateGallery(index);
                // Reset the auto-advance timer
                startGallerySlider();
            });
        });

        // Initialize: Show the first image and start the timer
        updateGallery(0); 
        startGallerySlider();

        console.log('Gallery Slider initialized.');
    }
});