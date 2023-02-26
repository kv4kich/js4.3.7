const searchInput = document.getElementById('search-input');
const autocompleteResults = document.getElementById('autocomplete-results');
const repoList = document.getElementById('repo-list');

function debounce(func, timeout = 600) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

async function searchRepositories(query) {
  const url = `https://api.github.com/search/repositories?q=${query}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.items.slice(0, 5);
}

function showAutocompleteResults(results) {
  autocompleteResults.innerHTML = '';
  results.forEach(result => {
    const li = document.createElement('li');
    li.innerText = result.full_name;
    li.addEventListener('click', () => {
      addRepository(result);
      searchInput.value = '';
      autocompleteResults.innerHTML = '';
    });
    autocompleteResults.appendChild(li);
  });
}

function addRepository(repo) {
  const li = document.createElement('li');
  li.innerHTML = `
    <span>Имя: ${repo.full_name}</span>
    <span>Автор: ${repo.owner.login}</span>
    <span>Звезды: ${repo.stargazers_count}</span>
    <button>Удалить</button>
  `;
  li.querySelector('button').addEventListener('click', () => {
    repoList.removeChild(li);
  });
  repoList.appendChild(li);
}

searchInput.addEventListener('input', debounce(async () => {
  const query = searchInput.value.trim();
  if (query) {
    const results = await searchRepositories(query);
    showAutocompleteResults(results);
  } else {
    autocompleteResults.innerHTML = '';
  }
}));

