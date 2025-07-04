// const outDiv = document.getElementById("outDiv");
// const btnSearch = document.getElementById("btnSearch");
// const btnReset = document.getElementById("btnReset");
// const inputField = document.getElementById("input");


// function resetForm() {
//     outDiv.innerHTML = "";
//     inputField.value = "";
// }

// function searchCondition() {
//     const input = document.getElementById('input').value.toLowerCase();
//     outDiv.innerHTML = '';

//     fetch('travel_recommendation_api.json')
//         .then(response => response.json())
//         .then(data => {
//             const country = data.countries.find(input => input.name.toLowerCase() === input);
            
//             if (country) {
//                 const cities = country.cities.map(city => `<li>${city.name} - ${city.description}</li>`).join('');
//                 outDiv.innerHTML += `<h2>${country.name}</h2>`;
//                 outDiv.innerHTML += `<img src="${country.imageUrl}" alt="${country.name}">`;
//                 outDiv.innerHTML += `<p>${country.description}</p>`;
//                 outDiv.innerHTML += `<h3>Cities:</h3><ul>${cities}</ul>`;
//             }

            
//         })

// }

// btnSearch.addEventListener('click', searchCondition);
// btnReset.addEventListener('click', resetForm);

// Search function
document.getElementById('btnSearch').addEventListener('click', () => {
  const keyword = document.getElementById('input').value.trim().toLowerCase();

  // 🔒 Do nothing if the input is empty
  if (!keyword) {
    document.getElementById('outDiv').innerHTML = '<p>Please enter a keyword to search.</p>';
    return;
  }

  fetch('travel_recommendation_api.json')
    .then(response => response.json())
    .then(data => {
      const results = searchTravelData(data, keyword);
      renderResults(results);
    })
    .catch(error => {
      console.error('Error loading data:', error);
      document.getElementById('outDiv').innerHTML = '<p>Error loading data.</p>';
    });
});




function searchTravelData(data, keyword) {
  const results = [];

  // Normalize keyword for broader matching
  const normalizedKeyword = keyword.toLowerCase().replace(/es$|s$/, '');

  const matches = (text) =>
    text.toLowerCase().includes(keyword) || text.toLowerCase().includes(normalizedKeyword);

  // Search cities
  data.countries.forEach(country => {
    country.cities.forEach(city => {
      if (
        matches(city.name) ||
        matches(city.description) ||
        matches('city') // explicitly check type too
      ) {
        results.push({ type: 'City', ...city });
      }
    });
  });

  // Search temples
  data.temples.forEach(temple => {
    if (
      matches(temple.name) ||
      matches(temple.description) ||
      matches('temple')
    ) {
      results.push({ type: 'Temple', ...temple });
    }
  });

  // Search beaches
  data.beaches.forEach(beach => {
    if (
      matches(beach.name) ||
      matches(beach.description) ||
      matches('beach')
    ) {
      results.push({ type: 'Beach', ...beach });
    }
  });

  return results;
}


function renderResults(results) {
  const outDiv = document.getElementById('outDiv');

  if (results.length === 0) {
    outDiv.classList.remove('has-results');
    outDiv.innerHTML = '<p>No matching results found.</p>';
    return;
  }
  outDiv.classList.add('has-results');
  outDiv.innerHTML = results.map(item => `
    <div class="result-card">
    <img src="${item.imageUrl}" alt="${item.name}"/>
    <div class="result-content">
    <h3>${item.type}: ${item.name}</h3>
      <p>${item.description}</p>
      </div>
      <button id="btn">Visit</button>
    </div>
  `).join('');
}

document.getElementById('btnReset').addEventListener('click', () => {
  const outDiv = document.getElementById('outDiv');
  document.getElementById('input').value = '';
  outDiv.innerHTML = '';
  outDiv.classList.remove('has-results');
});