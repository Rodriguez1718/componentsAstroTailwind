interface FadeUpOptions {
  duration?: number;   // ms, default 600
  delay?: number;      // ms, default 0
  distance?: number;   // px, default 40
  easing?: string;     // default 'ease-out'
}

const createFadeUp = (elementId: string, options: FadeUpOptions = {}): void => {
  const el = document.getElementById(elementId) as HTMLElement | null;
  if (!el) return;

  const {
    duration = 600,
    distance = 40,
    delay = 0,
    easing = 'ease-out',
  } = options;

  // Set initial state
  el.style.opacity = '0';

  el.style.transform = `translateY(${distance}px)`;
  el.style.transition = `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        observer.unobserve(el); // only triggers once
      }
    });
  }, { threshold: 0.1 }); // 0.1 = triggers when 10% of element is visible

  observer.observe(el);
};

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Hero content animation
  
  // Other animations (add IDs as needed)
  createFadeUp('my-element');
  createFadeUp('my-title', { delay: 200 });
  createFadeUp('cards-title', { delay: 200 });
  createFadeUp('cards-tinytitle', { delay: 200 });
  createFadeUp('cards-subtitle', { delay: 200 });
  createFadeUp('card-component', { duration: 800, distance: 60, delay: 400 });

    createFadeUp('json-title', { delay: 200 });
  createFadeUp('json-tinytitle', { delay: 200 });
  createFadeUp('json-subtitle', { delay: 200 });
  createFadeUp('json-component', { duration: 800, distance: 60, delay: 400 });

    createFadeUp('markdown-title', { delay: 200 });
  createFadeUp('markdown-tinytitle', { delay: 200 });
  createFadeUp('markdown-subtitle', { delay: 200 });
  createFadeUp('markdown-component', { duration: 800, distance: 60, delay: 400 });
});

//--------------------Fade in animation during page first load
type FadeDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface FadeInOptions {
  duration?: number;    // ms, default 600
  delay?: number;       // ms, default 0
  distance?: number;    // px, default 40
  easing?: string;      // default 'ease-out'
  direction?: FadeDirection; // default 'up'
}

const getTransform = (direction: FadeDirection, distance: number): string => {
  switch (direction) {
    case 'up':    return `translateY(${distance}px)`;
    case 'down':  return `translateY(-${distance}px)`;
    case 'left':  return `translateX(${distance}px)`;
    case 'right': return `translateX(-${distance}px)`;
    case 'none':  return 'none';
  }
};

const createFadeIn = (elementId: string, options: FadeInOptions = {}): void => {
  const el = document.getElementById(elementId) as HTMLElement | null;
  if (!el) return;

  const {
    duration = 600,
    delay = 0,
    distance = 40,
    easing = 'ease-out',
    direction = 'up',
  } = options;

  const transformFrom = getTransform(direction, distance);

  // Set initial state
  el.style.opacity = '0';
  if (transformFrom !== 'none') el.style.transform = transformFrom;
  el.style.transition = `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = direction !== 'none' ? 'translate(0, 0)' : '';
        observer.unobserve(el); // only triggers once
      }
    });
  }, { threshold: 0.1 }); // triggers when 10% of element is visible

  observer.observe(el);
};

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  createFadeIn('my-element');
  createFadeIn('my-title', { delay: 200 });

  // Direction examples
  createFadeIn('hero-title',  { direction: 'left',  delay: 100 });
  createFadeIn('hero-button', { direction: 'right', delay: 200 });
  createFadeIn('slide-from-top',   { direction: 'down',  delay: 300 });
  createFadeIn('just-fade',        { direction: 'none',  delay: 400 });
});