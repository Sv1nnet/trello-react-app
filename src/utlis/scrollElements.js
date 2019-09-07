/*
 * options - array width objects that contain:
 * elementToScroll - HTMLElement we want to scroll
 * distanceToStartScrollingX - int - distance in pixels between edge of element and cursor to start scrolling
 * scrollIntervals - object that contains scrollHorizontalInterval
 * scrollStep - int - distance in pixels an element will be scrolled by
 * scrollX - bool
 * scrollY - bool
 * scrollBoth - bool
 */

const scrollElements = (options) => {
  return (e) => {
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
      const rect = elementToScroll.getBoundingClientRect();

      // Scroll horizontal
      if (scrollX || scrollBoth) {
        // If mouse position less then distanceToStartScrollingX from the right edge of screen then scroll right
        if (((e.clientX - rect.x) >= distanceToStartScrollingX && (elementToScroll.offsetWidth - e.clientX) <= distanceToStartScrollingX)) {
          // Scroll is not on the right edge of screen
          const canScroll = elementToScroll.offsetWidth < (elementToScroll.scrollWidth - elementToScroll.scrollLeft);
          // If there is no scroll interval and we can scroll
          if (!scrollIntervals.scrollHorizontalInterval && canScroll) {
            scrollIntervals.scrollHorizontalInterval = setInterval(() => {
              const isEndOfScroll = elementToScroll.offsetWidth === (elementToScroll.scrollWidth - elementToScroll.scrollLeft);

              elementToScroll.scrollTo(elementToScroll.scrollLeft + scrollStepX, elementToScroll.scrollTop);

              if (isEndOfScroll) clearInterval(scrollIntervals.scrollHorizontalInterval);
            }, 1000 / 60);
          }
          // If mouse position less then distanceToStartScrollingX from the left edge of screen then scroll left
        } else if ((e.clientX - rect.x) <= distanceToStartScrollingX) {
          // Scroll is not on the left edge of screen
          const canScroll = elementToScroll.scrollLeft > 0;

          // If there is no scroll interval and we can scroll
          if (!scrollIntervals.scrollHorizontalInterval && canScroll) {
            scrollIntervals.scrollHorizontalInterval = setInterval(() => {
              const isEndOfScroll = elementToScroll.scrollLeft === 0;

              elementToScroll.scrollTo(elementToScroll.scrollLeft - scrollStepX, elementToScroll.scrollTop);

              if (isEndOfScroll) clearInterval(scrollIntervals.scrollHorizontalInterval);
            }, 1000 / 60);
          }
          // Otherwise clear scrollIntervar to stop scrolling
          // and set scrollHorizontalInterval undefined to let scroll handler know
          // does he needs to set a new scroll interval or another one still exists
        } else {
          clearInterval(scrollIntervals.scrollHorizontalInterval);
          scrollIntervals.scrollHorizontalInterval = undefined;
        }
      }

      // Scroll vertical
      if (scrollY || scrollBoth) {
        // If mouse position less then distanceToStartScrollingY from the top edge of screen then scroll right
        if (((e.clientY - rect.y) >= distanceToStartScrollingY && (elementToScroll.offsetHeight + rect.y - e.clientY) <= distanceToStartScrollingY)) {
          // Scroll is not on the top edge of screen
          const canScroll = elementToScroll.offsetHeight <= (elementToScroll.scrollHeight - elementToScroll.scrollTop);
          // If there is no scroll interval and we can scroll
          if (!scrollIntervals.scrollVerticalInterval && canScroll) {
            scrollIntervals.scrollVerticalInterval = setInterval(() => {
              const isEndOfScroll = elementToScroll.offsetHeight >= (elementToScroll.scrollHeight - elementToScroll.scrollTop);

              elementToScroll.scrollTo(elementToScroll.scrollLeft, elementToScroll.scrollTop + scrollStepY);

              if (isEndOfScroll) clearInterval(scrollIntervals.scrollVerticalInterval);
            }, 1000 / 60);
          }
          // If mouse position less then distanceToStartScrollingY from the bottom edge of screen then scroll left
        } else if ((e.clientY - rect.y) <= distanceToStartScrollingY) {
          // Scroll is not on the bottom edge of screen
          const canScroll = elementToScroll.scrollTop > 0;

          // If there is no scroll interval and we can scroll
          if (!scrollIntervals.scrollVerticalInterval && canScroll) {
            scrollIntervals.scrollVerticalInterval = setInterval(() => {
              const isEndOfScroll = elementToScroll.scrollTop <= 0;

              elementToScroll.scrollTo(elementToScroll.scrollLeft, elementToScroll.scrollTop - scrollStepY);

              if (isEndOfScroll) clearInterval(scrollIntervals.scrollVerticalInterval);
            }, 1000 / 60);
          }
          // Otherwise clear scrollIntervar to stop scrolling
          // and set scrollHorizontalInterval undefined to let scroll handler know
          // does he needs to set a new scroll interval or another one still exists
        } else {
          clearInterval(scrollIntervals.scrollVerticalInterval);
          scrollIntervals.scrollVerticalInterval = undefined;
        }
      }
    });
  };
};

export default scrollElements;
