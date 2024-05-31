const applicationID = "TS106XF7Y9"
const apiKey = 'da97fcc72d5377406b5da395ade6f5f5'
const restaurants = 'JSON'

const client = algoliasearch(applicationID, apiKey)
const helper = algoliasearchHelper(client, restaurants, {
  disjunctiveFacets: ['food_type', 'stars_count', 'payment_options'],
  hitsPerPage: 5,
  maxValuesPerFacet: 7
})

helper.on('result', function(content) {
  console.log(content);
  if (content.results.hits.length === 0) {
    $('.results').html(renderNoHits());
    return;
  }
  renderHits(content);
  renderFacetList(content);
});

function renderNoHits() {
  return `<div id="no-results-message">
            <p>We didn't find any results for the search <em>"${$('#search-bar__input').val()}"</em>.</p>
            <a href="." className='clear-all'>Clear search</a>
          </div>`
}
  function renderHits(content) {
    $('.results').html(function () {
      return $.map(content.results.hits, function (hit) {
        let stars = Math.round(hit.stars_count * 2) / 2
        let colouredStarsHTML
        let blankStarsHTML
        if (stars % 1 === 0) {
          colouredStarsHTML = '<span class="fa fa-star checked"></span>'.repeat(Math.round(stars))
          blankStarsHTML = '<span class="fa fa-star-o"></span>'.repeat(5 - Math.round(stars))
        } else {
          colouredStarsHTML = '<span class="fa fa-star checked"></span>'.repeat(Math.floor(stars)) + '<span class="fa fa-star-half-o"></span>'
          let remainingStarCount = 5 - Math.ceil(stars)
          blankStarsHTML = remainingStarCount ? '<span class="fa fa-star-o checked"></span>'.repeat(5 - Math.ceil(stars)) : ''
        }
        return `<div class="results__item">
                <a href="${hit.reserve_url}" class="result__button"><div class="result">
                    <div class="result__image-container">
                        <img src="${hit.image_url}" alt="${hit.name}" class="result__image">
                    </div>
                    <div class="result__text-container">
                        <h1 class="result__title">${hit.name}</h1>
                        <div class="result__rating">
                            <p>${hit.stars_count} ${colouredStarsHTML}${blankStarsHTML} <span class="reviews">(${hit.reviews_count} reviews)</span></p>

                        </div>
                        <p class="result__summary">${hit.food_type} | ${hit.neighborhood} | ${hit.price_range}</p>
                    </div>
                    </div></a>
                </div>`;
      });
    });
  }

  $('#filter').on('click', 'input[type=checkbox]', function (e) {
    var facetValue = $(this).data('facet');
    helper.toggleRefinement('food_type', facetValue)
      .search();
  });

  function renderFacetList(content) {
    $('#filter').html(function () {
      return $.map(content.results.getFacetValues('food_type'), function (facet) {
        var checkbox = $('<input type="checkbox" class>')
          .data('facet', facet.name)
          .attr('id', 'fl-' + facet.name);
        if (facet.isRefined) checkbox.attr('checked', 'checked');
        var label = $('<label class="filter__label">').html(facet.name + ' (' + facet.count + ')')
          .attr('for', 'fl-' + facet.name);
        return $('<li>').append(checkbox).append(label);
      });
    });
  }


  $('#search-bar__input').on('keyup', function () {
    helper.setQuery($(this).val())
      .search();
  });

  helper.search();
