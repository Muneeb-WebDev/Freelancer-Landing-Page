document.addEventListener('DOMContentLoaded', init);

function init() {
    initSmoothAnchors();
    initMobileMenu('menu-btn', 'menu');
    initFAQ('faq-item');
    initScrollReveal('section', { threshold: 0.12 });
}

function initSmoothAnchors() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
        (function (a) {
            a.addEventListener('click', function (e) {
                var href = a.getAttribute('href');
                if (!href || href === '#') return;
                e.preventDefault();
                var target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                var menuBtn = document.getElementById('menu-btn');
                var mobileMenu = document.getElementById('menu');
                if (menuBtn && mobileMenu && menuBtn.getAttribute('aria-expanded') === 'true') {
                    toggleMobileMenu(menuBtn, mobileMenu, false);
                }
            });
        })(anchors[i]);
    }
}

function initMobileMenu(menuBtnId, menuId) {
    var menuBtn = document.getElementById(menuBtnId);
    var mobileMenu = document.getElementById(menuId);
    if (!menuBtn || !mobileMenu) return;

    // prepare styles for animation
    mobileMenu.style.overflow = 'hidden';
    mobileMenu.style.maxHeight = '0px';
    mobileMenu.style.transition = 'max-height 320ms ease, opacity 220ms ease';
    mobileMenu.style.opacity = '0';
    mobileMenu.style.display = 'block';

    menuBtn.setAttribute('aria-expanded', 'false');

    menuBtn.addEventListener('click', function () {
        var isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
        toggleMobileMenu(menuBtn, mobileMenu, !isOpen);
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth >= 768) {
            mobileMenu.style.maxHeight = '';
            mobileMenu.style.opacity = '';
            mobileMenu.style.overflow = '';
        } else {
            var expanded = menuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenu.style.maxHeight = expanded ? mobileMenu.scrollHeight + 'px' : '0px';
        }
    });
}

function toggleMobileMenu(menuBtn, mobileMenu, open) {
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
        mobileMenu.style.opacity = '1';
    } else {
        mobileMenu.style.maxHeight = '0px';
        mobileMenu.style.opacity = '0';
    }
}

function initFAQ(itemClassName) {
    var items = document.getElementsByClassName(itemClassName);
    if (!items || items.length === 0) return;

    for (var i = 0; i < items.length; i++) {
        (function (item) {
            var btn = item.querySelector('.faq-button');
            var answer = item.querySelector('.faq-answer');
            var icon = btn ? btn.querySelector('svg') : null;

            if (!btn || !answer) return;

            answer.style.display = 'block';
            answer.style.overflow = 'hidden';
            answer.style.maxHeight = '0px';
            answer.style.opacity = '0';
            answer.style.transition = 'max-height 320ms ease, opacity 240ms ease';
            if (icon) icon.style.transition = 'transform 320ms ease';

            btn.setAttribute('aria-expanded', 'false');

            btn.addEventListener('click', function () {
                var expanded = btn.getAttribute('aria-expanded') === 'true';

                for (var j = 0; j < items.length; j++) {
                    var other = items[j];
                    if (other === item) continue;
                    var ob = other.querySelector('.faq-button');
                    var oa = other.querySelector('.faq-answer');
                    var oi = ob ? ob.querySelector('svg') : null;
                    if (ob) ob.setAttribute('aria-expanded', 'false');
                    if (oa) {
                        oa.style.maxHeight = '0px';
                        oa.style.opacity = '0';
                    }
                    if (oi) oi.style.transform = 'rotate(0deg)';
                    other.classList.remove('ring-2', 'ring-[#25A4AD]', 'ring-opacity-50');
                }

                btn.setAttribute('aria-expanded', (!expanded).toString());
                if (!expanded) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    answer.style.opacity = '1';
                    if (icon) icon.style.transform = 'rotate(180deg)';
                    item.classList.add('ring-2', 'ring-[#25A4AD]', 'ring-opacity-50');
                } else {
                    answer.style.maxHeight = '0px';
                    answer.style.opacity = '0';
                    if (icon) icon.style.transform = 'rotate(0deg)';
                    item.classList.remove('ring-2', 'ring-[#25A4AD]', 'ring-opacity-50');
                }
            });
        })(items[i]);
    }
}

function initScrollReveal(selector, opts) {
    var defaultOpts = { root: null, rootMargin: '0px', threshold: 0.12 };
    var options = defaultOpts;
    if (opts) {
        for (var k in opts) {
            if (opts.hasOwnProperty(k)) options[k] = opts[k];
        }
    }

    if (typeof IntersectionObserver === 'undefined') {
        var secs = document.getElementsByTagName('section');
        for (var s = 0; s < secs.length; s++) {
            secs[s].classList.remove('opacity-0');
            secs[s].classList.add('animate-fade-in');
        }
        return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
        for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (!entry.isIntersecting) continue;
            var el = entry.target;
            el.classList.add('animate-fade-in');
            el.classList.remove('opacity-0');

            var staggerItems = el.querySelectorAll('.stagger-item');
            for (var m = 0; m < staggerItems.length; m++) {
                var child = staggerItems[m];
                child.style.transitionDelay = (m * 80) + 'ms';
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }

            obs.unobserve(el);
        }
    }, options);

    var sections = document.querySelectorAll(selector);
    for (var i = 0; i < sections.length; i++) {
        sections[i].classList.add('opacity-0');
        observer.observe(sections[i]);
    }
}
