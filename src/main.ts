type FadeDirection = 'up' | 'down' | 'left' | 'right';
 
interface FadeUpOptions {
  duration?: number;         // ms, default 600
  delay?: number;            // ms, default 0
  distance?: number;         // px, default 40
  easing?: string;           // default 'ease-out'
  direction?: FadeDirection; // default 'up'
  triggerOnView?: boolean;   // default false — fires immediately on call
}
 
const getInitialTransform = (direction: FadeDirection, distance: number): string => {
  switch (direction) {
    case 'up':    return `translateY(${distance}px)`;
    case 'down':  return `translateY(-${distance}px)`;
    case 'left':  return `translateX(${distance}px)`;
    case 'right': return `translateX(-${distance}px)`;
  }
};
 
const createFadeUp = (elementId: string, options: FadeUpOptions = {}): () => void => {
  const el = document.getElementById(elementId);
  if (!el) {
    console.warn(`createFadeUp: element with id "${elementId}" not found.`);
    return () => {};
  }
 
  const {
    duration = 600,
    distance = 40,
    delay = 0,
    easing = 'ease-out',
    direction = 'up',
    triggerOnView = false,
  } = options;
 
  const transition = `opacity ${duration}ms ${easing} ${delay}ms, transform ${duration}ms ${easing} ${delay}ms`;
 
  // Set hidden state WITHOUT transition so the browser paints it as-is first.
  // Adding the transition here would mean there's nothing to animate from.
  el.style.opacity = '0';
  el.style.transform = getInitialTransform(direction, distance);
  el.style.transition = 'none';
 
  const applyFinalState = () => {
    el.style.transition = transition;
    el.style.opacity = '1';
    el.style.transform = 'translate(0, 0)';
  };
 
  if (triggerOnView) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          applyFinalState();
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1 });
 
    observer.observe(el);
    return () => observer.disconnect();
  } else {
    // Double rAF: first frame commits the hidden state, second adds the
    // transition and final values so the browser animates between them.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(applyFinalState);
    });
    return () => cancelAnimationFrame(raf);
  }
};
 
// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // triggerOnView: false (default) — animates on page load
  createFadeUp('hero-subtitle', { direction: 'left', delay: 200 });
  createFadeUp('hero-button', { direction: 'right', delay: 200 });
  createFadeUp('button-num', { direction: 'right', delay: 200, triggerOnView: true });
  createFadeUp('button-des', { direction: 'right', duration: 900, triggerOnView: true });
  createFadeUp('button-variant-title', { direction: 'right', duration: 900, triggerOnView: true });
  createFadeUp('button-variant', { direction: 'up', duration: 900, triggerOnView: true });
  createFadeUp('button-size-title', { direction: 'right', duration: 900, triggerOnView: true });
  createFadeUp('button-size', { direction: 'up', duration: 900, triggerOnView: true });
  createFadeUp('button-width-title', { direction: 'right', duration: 900, triggerOnView: true });
  createFadeUp('button-width', { direction: 'up', duration: 900, triggerOnView: true });
  createFadeUp('cards-tinytitle', { direction: 'right', delay: 200, triggerOnView: true });
  createFadeUp('cards-subtitle', { direction: 'right', duration: 900, triggerOnView: true });
  createFadeUp('card-component', { direction: 'up', duration: 900, triggerOnView: true });
  createFadeUp('json-tinytitle', { direction: 'right', delay: 200, triggerOnView: true });
  createFadeUp('json-subtitle', { direction: 'right', duration: 900, triggerOnView: true });
  createFadeUp('json-component', { direction: 'up', duration: 900, triggerOnView: true });
  createFadeUp('markdown-tinytitle', { direction: 'right', delay: 200, triggerOnView: true });
  createFadeUp('markdown-subtitle', { direction: 'right', duration: 900, triggerOnView: true });
  createFadeUp('markdown-component', { direction: 'up', duration: 900, triggerOnView: true });

  // triggerOnView: true — animates when scrolled into view
  // createFadeUp('cards-tinytitle', { delay: 200, triggerOnView: true });
  // createFadeUp('cards-subtitle',  { delay: 200, triggerOnView: true });
  // createFadeUp('card-component',  { duration: 800, distance: 60, delay: 400, triggerOnView: true });
});
 
// Usage examples:
// createFadeUp('my-element');                                               // fires on page load, slides up
// createFadeUp('my-element', { direction: 'left' });                       // fires on page load, slides in from right
// createFadeUp('my-element', { direction: 'left', triggerOnView: true });  // waits until scrolled into view
// createFadeUp('my-element', { direction: 'up',   triggerOnView: true });  // waits until scrolled into view, slides up
 
 
//------------------Fade in letter by letter animation

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface FadeInTextOptions {
  /** Delay between each character in ms (default: 60) */
  charDelay?: number;
  /** Duration of each character's fade in ms (default: 400) */
  fadeDuration?: number;
  /** Initial delay before animation starts in ms (default: 0) */
  startDelay?: number;
  /** Trigger animation when element enters viewport (default: false) */
  triggerOnView?: boolean;
  /** Called when the animation completes */
  onComplete?: () => void;
}

// ─────────────────────────────────────────────
// Core animator — works on any HTMLElement
// ─────────────────────────────────────────────
function animateElement(el: HTMLElement, options: FadeInTextOptions = {}): () => void {
  const {
    charDelay = 60,
    fadeDuration = 400,
    startDelay = 0,
    onComplete,
  } = options;

  const text = el.textContent ?? "";
  el.setAttribute("aria-label", text);
  el.innerHTML = "";

  const timers: ReturnType<typeof setTimeout>[] = [];

  text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.cssText = `
      display: inline-block;
      opacity: 0;
      transform: translateX(12px);
      ${char === " " ? "white-space: pre;" : ""}
    `;
    el.appendChild(span);

    const t = setTimeout(() => {
      span.style.transition = `opacity ${fadeDuration}ms ease, transform ${fadeDuration}ms ease`;
      span.style.opacity = "1";
      span.style.transform = "translateX(0)";
      if (i === text.length - 1) onComplete?.();
    }, startDelay + i * charDelay);

    timers.push(t);
  });

  return () => timers.forEach(clearTimeout);
}

// ─────────────────────────────────────────────
// applyFadeInText — apply by element id(s)
// ─────────────────────────────────────────────
/**
 * Apply the fade-in-from-right animation to one or more elements by their id.
 *
 * @param ids     A single id string or an array of id strings.
 * @param options Animation options (charDelay, fadeDuration, startDelay, triggerOnView, onComplete).
 * @returns       A cleanup function that cancels all pending timers.
 *
 * @example
 * applyFadeInText("hero-title");
 * applyFadeInText(["hero-title", "hero-subtitle"], { charDelay: 40, triggerOnView: true });
 */
export function applyFadeInText(
  ids: string | string[],
  options: FadeInTextOptions = {}
): () => void {
  const idList = Array.isArray(ids) ? ids : [ids];
  const cleanups: Array<() => void> = [];

  idList.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(`applyFadeInText: element with id "${id}" not found.`);
      return;
    }

    if (options.triggerOnView) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const cleanup = animateElement(el, options);
            cleanups.push(cleanup);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
      cleanups.push(() => observer.disconnect());
    } else {
      cleanups.push(animateElement(el, options));
    }
  });

  return () => cleanups.forEach((fn) => fn());
}

applyFadeInText("hero-title");
applyFadeInText("cards-title", { triggerOnView: true, charDelay: 40 });
applyFadeInText("button-title", { triggerOnView: true, charDelay: 40 });
applyFadeInText("json-title", { triggerOnView: true, charDelay: 40 });
applyFadeInText("markdown-title", { triggerOnView: true, charDelay: 40 });

// ─────────────────────────────────────────────
// Usage examples
// ─────────────────────────────────────────────

/*
// ── 1. By id — single element ─────────────────────────────────────────────────
//
//   <h1 id="hero-title">Hello, World!</h1>
//
applyFadeInText("hero-title");


// ── 2. By id — multiple elements ─────────────────────────────────────────────
//
//   <h1 id="hero-title">Hello, World!</h1>
//   <p  id="hero-subtitle">Welcome to my site.</p>
//
applyFadeInText(["hero-title", "hero-subtitle"], { charDelay: 50 });


// ── 3. Staggered — subtitle starts after title finishes ───────────────────────
//
applyFadeInText("hero-title",    { charDelay: 50 });
applyFadeInText("hero-subtitle", { charDelay: 50, startDelay: 700 });


// ── 4. Trigger when element scrolls into view ────────────────────────────────
//
applyFadeInText("section-heading", { triggerOnView: true, charDelay: 40 });


// ── 5. Cleanup (SPA route changes) ─────────────────────────────────────────────
//
const cleanup = applyFadeInText(["hero-title", "hero-subtitle"], {
  charDelay: 55,
  fadeDuration: 350,
  startDelay: 200,
});
// Call cleanup() when needed to cancel timers
*/