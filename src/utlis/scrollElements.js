/**
 * Get a function that has to be hired on mouseMove event.
 * @param {Object[]} options - array width objects that contain options for scrolling.
 * @param {HTMLElement} options.elementToScroll - HTMLElement or React ref object we want to scroll.
 * @param {number} [options.distanceToStartScrollingX=20] - int - distance in pixels between edge of element and cursor to start scrolling.
 * @param {number} [options.distanceToStartScrollingY=20] - int - distance in pixels between edge of element and cursor to start scrolling.
 * @param {Object} options.scrollIntervals - object that contains scrollHorizontalInterval.
 * @param {number} options.scrollIntervals.scrollHorizontalInterval - object that contains scrollHorizontalInterval.
 * @param {number} options.scrollIntervals.scrollVerticalInterval - object that contains scrollHorizontalInterval.
 * @param {boolean} [options.scrollX=5] - should we scroll acroos this axis.
 * @param {boolean} [options.scrollY=5] - should we scroll acroos this axis.
 * @param {boolean} [options.scrollBoth=false] - should we scroll both axises.
 * @param {number} [options.scrollStepX=false] - int - distance in pixels an element will be scrolled by.
 * @param {number} [options.scrollStepY=false] - int - distance in pixels an element will be scrolled by.
 * @returns function to be added on mouseMove event on an element that we want to scroll
 */

const scrollElements = options => (e) => {
  options.forEach((option) => {
    const {
      elementToScroll,
      scrollIntervals,
      distanceToStartScrollingX = 20,
      distanceToStartScrollingY = 20,
      scrollStepX = 5,
      scrollStepY = 5,
      scrollBoth = false,
      scrollX = scrollBoth,
      scrollY = scrollBoth,
    } = option;
    // console.log('mouse move', elementToScroll)

    const HTMLElement = elementToScroll.getBoundingClientRect ? elementToScroll : elementToScroll.current;
    const rect = HTMLElement.getBoundingClientRect();

    // Scroll horizontal
    if (scrollX || scrollBoth) {
      // If mouse position less then distanceToStartScrollingX from the right edge of element then scroll right
      if (((e.clientX - rect.x) >= distanceToStartScrollingX && (HTMLElement.offsetWidth - e.clientX) <= distanceToStartScrollingX)) {
        // Scroll is not on the right edge of element
        const canScroll = HTMLElement.offsetWidth < (HTMLElement.scrollWidth - HTMLElement.scrollLeft);
        // If there is no current horizontal scroll interval and we can scroll
        if (!scrollIntervals.scrollHorizontalInterval && canScroll) {
          scrollIntervals.scrollHorizontalInterval = setInterval(() => {
            const isEndOfScroll = HTMLElement.offsetWidth === (HTMLElement.scrollWidth - HTMLElement.scrollLeft);

            if (HTMLElement.scrollTo) HTMLElement.scrollTo(HTMLElement.scrollLeft + scrollStepX, HTMLElement.scrollTop);
            else HTMLElement.scrollLeft += scrollStepX;

            if (isEndOfScroll) clearInterval(scrollIntervals.scrollHorizontalInterval);
          }, 1000 / 60);
        }
        // If mouse position less then distanceToStartScrollingX from the left edge of element then scroll left
      } else if ((e.clientX - rect.x) <= distanceToStartScrollingX) {
        // Scroll is not on the left edge of element
        const canScroll = HTMLElement.scrollLeft > 0;

        // If there is no current horizontal scroll interval and we can scroll
        if (!scrollIntervals.scrollHorizontalInterval && canScroll) {
          scrollIntervals.scrollHorizontalInterval = setInterval(() => {
            const isEndOfScroll = HTMLElement.scrollLeft === 0;

            if (HTMLElement.scrollTo) HTMLElement.scrollTo(HTMLElement.scrollLeft - scrollStepX, HTMLElement.scrollTop);
            else HTMLElement.scrollLeft -= scrollStepX;

            if (isEndOfScroll) clearInterval(scrollIntervals.scrollHorizontalInterval);
          }, 1000 / 60);
        }
        // Otherwise clear scrollHorizontalInterval to stop scrolling
        // and set scrollHorizontalInterval undefined to let scroll handler know
        // does he need to set a new scroll interval or another one still exists
      } else {
        clearInterval(scrollIntervals.scrollHorizontalInterval);
        scrollIntervals.scrollHorizontalInterval = null;
      }
    }

    // Scroll vertical
    if (scrollY || scrollBoth) {
      // If mouse position less then distanceToStartScrollingY from the top edge of element then scroll down
      if (((e.clientY - rect.y) >= distanceToStartScrollingY && (HTMLElement.offsetHeight + rect.y - e.clientY) <= distanceToStartScrollingY)) {
        // Scroll is not on the top edge of screen
        const canScroll = HTMLElement.offsetHeight <= (HTMLElement.scrollHeight - HTMLElement.scrollTop);
        // If there is no current vertical scroll interval and we can scroll
        if (!scrollIntervals.scrollVerticalInterval && canScroll) {
          scrollIntervals.scrollVerticalInterval = setInterval(() => {
            const isEndOfScroll = HTMLElement.offsetHeight >= (HTMLElement.scrollHeight - HTMLElement.scrollTop);

            if (HTMLElement.scrollTo) HTMLElement.scrollTo(HTMLElement.scrollLeft, HTMLElement.scrollTop + scrollStepY);
            else HTMLElement.scrollTop += scrollStepY;

            if (isEndOfScroll) clearInterval(scrollIntervals.scrollVerticalInterval);
          }, 1000 / 60);
        }
        // If mouse position less then distanceToStartScrollingY from the bottom edge of element then scroll up
      } else if ((e.clientY - rect.y) <= distanceToStartScrollingY) {
        // Scroll is not on the bottom edge of element
        const canScroll = HTMLElement.scrollTop > 0;

        // If there is no current vertical scroll interval and we can scroll
        if (!scrollIntervals.scrollVerticalInterval && canScroll) {
          scrollIntervals.scrollVerticalInterval = setInterval(() => {
            const isEndOfScroll = HTMLElement.scrollTop <= 0;

            if (HTMLElement.scrollTo) HTMLElement.scrollTo(HTMLElement.scrollLeft, HTMLElement.scrollTop - scrollStepY);
            else HTMLElement.scrollTop -= scrollStepY;

            if (isEndOfScroll) clearInterval(scrollIntervals.scrollVerticalInterval);
          }, 1000 / 60);
        }
        // Otherwise clear scrollVerticalInterval to stop scrolling
        // and set scrollVerticalInterval undefined to let scroll handler know
        // does he need to set a new vertical scroll interval or another one still exists
      } else {
        clearInterval(scrollIntervals.scrollVerticalInterval);
        scrollIntervals.scrollVerticalInterval = null;
      }
    }
  });
};

export default scrollElements;
