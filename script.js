document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Sticky Navigation Scroll Effect
  // ==========================================
  const header = document.getElementById('header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 2. Mobile Drawer Navigation Sidebar
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const sidebarClose = document.getElementById('sidebar-close');
  const sidebar = document.getElementById('mobile-sidebar');
  const overlay = document.getElementById('menu-overlay');

  const openMenu = () => {
    sidebar.classList.add('show');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // prevent background scrolling
  };

  const closeMenu = () => {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
    document.body.style.overflow = ''; // re-enable scrolling
  };

  menuToggle.addEventListener('click', openMenu);
  sidebarClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  // Close menu when clicking links
  const mobileLinks = [
    'mobile-link-how',
    'mobile-link-quiz',
    'mobile-link-spots',
    'mobile-link-submit',
    'mobile-link-cta'
  ];

  mobileLinks.forEach(id => {
    const linkEl = document.getElementById(id);
    if (linkEl) {
      linkEl.addEventListener('click', closeMenu);
    }
  });


  // ==========================================
  // 3. Interactive Study Spot Quiz Logic
  // ==========================================
  const chips = document.querySelectorAll('.quiz-chip');
  const placeholder = document.getElementById('quiz-placeholder');
  const recCard = document.getElementById('quiz-recommendation-card');
  
  // DOM elements in recommendation card
  const recTitle = document.getElementById('rec-title');
  const recDesc = document.getElementById('rec-desc');
  const rateOverall = document.getElementById('rate-overall');
  const rateQuiet = document.getElementById('rate-quiet');
  const rateFood = document.getElementById('rate-food');
  const rateComfort = document.getElementById('rate-comfort');
  const rateAtmosphere = document.getElementById('rate-atmosphere');
  const rateXFactor = document.getElementById('rate-xfactor');

  // Study spots database
  const spotsData = {
    lobby: {
      title: "לובי הפקולטה לנתונים",
      desc: "אווירה סטודנטיאלית, ספות, שולחנות וחברים באזור. מתאים למי שרוצה לשלב למידה עם מפגש חברתי קל.",
      overall: "4.0",
      ratings: { quiet: "2.5/5", food: "4/5", comfort: "4.5/5", atmosphere: "4.5/5", xfactor: "5/5" }
    },
    ullman: {
      title: "קומת הלמידה באולמן",
      desc: "שולחנות גדולים, שקעים בכל פינה, מתאים למי שרוצה ללמוד ברצינות ולסגור משימות בריכוז גבוה.",
      overall: "3.5",
      ratings: { quiet: "4.5/5", food: "2.5/5", comfort: "3.5/5", atmosphere: "3/5", xfactor: "3.5/5" }
    },
    coffee: {
      title: "עגלת הקפה",
      desc: "קפה שווה במיוחד, עצירה טובה בין שיעורים, מושלם ללמידה קצרה על פלאטפורמה פתוחה או להפסקה.",
      overall: "4.0",
      ratings: { quiet: "2/5", food: "4.5/5", comfort: "3/5", atmosphere: "4/5", xfactor: "4/5" }
    },
    yagur: {
      title: "בריכת יגור",
      desc: "מקום פתוח באוויר הצח, אווירה מיוחדת ומבודדת מהקמפוס הראשי, מושלם לשבירת שגרה.",
      overall: "3.5",
      ratings: { quiet: "3.5/5", food: "3.5/5", comfort: "2.5/5", atmosphere: "5/5", xfactor: "4/5" }
    }
  };

  // State to hold selected filters
  let selectedFilters = new Set();

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filter = chip.getAttribute('data-filter');
      
      // Toggle selection
      if (selectedFilters.has(filter)) {
        selectedFilters.delete(filter);
        chip.classList.remove('active');
      } else {
        selectedFilters.add(filter);
        chip.classList.add('active');
      }
      
      updateRecommendation();
    });
  });

  function updateRecommendation() {
    // If no filters selected, show placeholder and hide recommendation card
    if (selectedFilters.size === 0) {
      recCard.style.opacity = '0';
      recCard.style.transform = 'translateY(12px) scale(0.99)';
      setTimeout(() => {
        recCard.style.display = 'none';
        placeholder.style.display = 'flex';
      }, 200);
      return;
    }

    // Recommendation logic based on selected filters
    let recommendation = null;

    if (selectedFilters.has('social') || selectedFilters.has('comfort')) {
      recommendation = spotsData.lobby;
    } else if (selectedFilters.has('quiet') || selectedFilters.has('power')) {
      recommendation = spotsData.ullman;
    } else if (selectedFilters.has('coffee')) {
      recommendation = spotsData.coffee;
    } else if (selectedFilters.has('outdoor')) {
      recommendation = spotsData.yagur;
    } else {
      // Default fallback
      recommendation = spotsData.lobby;
    }

    // Update Content with animation transition
    // Fade out first
    if (recCard.classList.contains('show')) {
      recCard.style.opacity = '0';
      recCard.style.transform = 'translateY(12px) scale(0.99)';
      
      setTimeout(() => {
        displaySpotData(recommendation);
        // Fade back in
        recCard.style.display = 'block';
        placeholder.style.display = 'none';
        
        // Force reflow
        recCard.offsetHeight;
        
        recCard.style.opacity = '1';
        recCard.style.transform = 'translateY(0) scale(1)';
        recCard.classList.add('show');
      }, 200);
    } else {
      // First show transition
      displaySpotData(recommendation);
      placeholder.style.display = 'none';
      recCard.style.display = 'block';
      
      // Force reflow
      recCard.offsetHeight;
      
      recCard.style.opacity = '1';
      recCard.style.transform = 'translateY(0) scale(1)';
      recCard.classList.add('show');
    }
  }

  function displaySpotData(spot) {
    recTitle.textContent = spot.title;
    recDesc.textContent = spot.desc;
    rateOverall.textContent = spot.overall;
    rateQuiet.textContent = spot.ratings.quiet;
    rateFood.textContent = spot.ratings.food;
    rateComfort.textContent = spot.ratings.comfort;
    rateAtmosphere.textContent = spot.ratings.atmosphere;
    rateXFactor.textContent = spot.ratings.xfactor;
  }

  // ==========================================
  // 5. Submit Place Form Mockup Logic
  // ==========================================
  const form = document.getElementById('suggest-place-form');
  const successState = document.getElementById('form-success-message');

  form.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent actual page reload

    // Simulate sending data by fading out form and showing success message
    form.style.transition = 'opacity 0.3s ease';
    form.style.opacity = '0';
    
    setTimeout(() => {
      form.style.display = 'none';
      successState.style.display = 'flex';
      successState.style.opacity = '0';
      
      // Force reflow
      successState.offsetHeight;
      
      successState.style.transition = 'opacity 0.4s ease';
      successState.style.opacity = '1';
    }, 300);
  });

});
