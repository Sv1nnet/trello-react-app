onmessage = (e) => {
  var cards = e.data.cards;
  var query = e.data.query;

  var result = [];

  if (query) {
    for (var i = 0; i < cards.length; i += 1) {
      if (cards[i].title.indexOf(query) !== -1) result.push(cards[i]);
    }
  }

  postMessage(result);
};
