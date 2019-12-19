/**
 *
 * @param options {Array} array width objects that contain options for scrolling:
 * 1) elementToScroll - HTMLElement we want to scroll.
 * 2) distanceToStartScrollingX - int - distance in pixels between edge of element and cursor to start scrolling.
 * 3) scrollIntervals - object that contains scrollHorizontalInterval.
 * 4) scrollStep - int - distance in pixels an element will be scrolled by.
 * 5) scrollX - bool.
 * 6) scrollY - bool.
 * 7) scrollBoth - bool.
 */

const scrollElements = options => (e) => {
  console.log('mouse move')
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

    const HTMLElement = elementToScroll.getBoundingClientRect ? elementToScroll : elementToScroll.current;
    const rect = HTMLElement.getBoundingClientRect ? HTMLElement.getBoundingClientRect() : HTMLElement.current.getBoundingClientRect();

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

            HTMLElement.scrollTo(HTMLElement.scrollLeft + scrollStepX, HTMLElement.scrollTop);

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

            HTMLElement.scrollTo(HTMLElement.scrollLeft - scrollStepX, HTMLElement.scrollTop);

            if (isEndOfScroll) clearInterval(scrollIntervals.scrollHorizontalInterval);
          }, 1000 / 60);
        }
        // Otherwise clear scrollHorizontalInterval to stop scrolling
        // and set scrollHorizontalInterval undefined to let scroll handler know
        // does he need to set a new scroll interval or another one still exists
      } else {
        clearInterval(scrollIntervals.scrollHorizontalInterval);
        scrollIntervals.scrollHorizontalInterval = undefined;
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

            HTMLElement.scrollTo(HTMLElement.scrollLeft, HTMLElement.scrollTop + scrollStepY);

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

            HTMLElement.scrollTo(HTMLElement.scrollLeft, HTMLElement.scrollTop - scrollStepY);

            if (isEndOfScroll) clearInterval(scrollIntervals.scrollVerticalInterval);
          }, 1000 / 60);
        }
        // Otherwise clear scrollVerticalInterval to stop scrolling
        // and set scrollVerticalInterval undefined to let scroll handler know
        // does he need to set a new vertical scroll interval or another one still exists
      } else {
        clearInterval(scrollIntervals.scrollVerticalInterval);
        scrollIntervals.scrollVerticalInterval = undefined;
      }
    }
  });
};

export default scrollElements;
