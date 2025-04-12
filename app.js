const searchInput = document.getElementById('searchInput');
const autocompleteList = document.getElementById('autocompleteList');
const reposList = document.getElementById('reposList');

let debounceTimer;

function debounce(func, delay) {
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}


async function searchRepositories(query) {
    if (!query) {
        autocompleteList.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`);
        const data = await response.json();
        showAutocomplete(data.items);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function showAutocomplete(repos) {
    autocompleteList.innerHTML = '';
    if (repos && repos.length > 0) {
        repos.forEach(repo => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            div.textContent = repo.full_name;
            div.onclick = () => addRepo(repo);
            autocompleteList.appendChild(div);
        });
        autocompleteList.style.display = 'block';
    } else {
        autocompleteList.style.display = 'none';
    }
}


function addRepo(repo) {
    const repoItem = document.createElement('div');
    repoItem.className = 'repo-item';
    repoItem.innerHTML = `
        <div class="repo-info">
            <div class="repo-name">${repo.name}</div>
            <div class="repo-owner">Owner: ${repo.owner.login}</div>
        </div>
        <div class="repo-stars">Stars: ${repo.stargazers_count}</div>
        <button class="delete-btn">Delete</button>
    `;

    repoItem.querySelector('.delete-btn').onclick = () => {
        repoItem.remove();
    };

    reposList.appendChild(repoItem);
    searchInput.value = '';
    autocompleteList.style.display = 'none';
}


searchInput.addEventListener('input', debounce((e) => {
    searchRepositories(e.target.value.trim());
}, 500));