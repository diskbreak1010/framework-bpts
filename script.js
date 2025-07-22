const form = document.getElementById('resolution-form');
const resultDiv = document.getElementById('result');
const basePath = 'data/tripadvisor';
let pathParts = [];

function createDropdown(options, level) {
  const select = document.createElement('select');
  select.innerHTML = `<option value="">Select ${capitalize(level)}</option>`;
  options.forEach(option => {
    select.innerHTML += `<option value="${option}">${capitalize(option)}</option>`;
  });

  select.addEventListener('change', async () => {
    const index = Array.from(form.children).indexOf(select);
    pathParts = pathParts.slice(0, index);
    form.innerHTML = Array.from(form.children).slice(0, index + 1).map(el => el.outerHTML).join('');
    pathParts.push(select.value);
    await handleNextDropdown(pathParts);
  });

  form.appendChild(select);
}

async function handleNextDropdown(path) {
  const filePath = `${basePath}/${path.join('/')}`;
  try {
    const response = await fetch(`${filePath}.json`);
    if (response.ok) {
      const data = await response.json();
      showResolution(data);
    } else {
      const folder = await fetchFolder(path.join('/'));
      if (folder) {
        createDropdown(folder, `option`);
      }
    }
  } catch (e) {
    console.error('Fetch error:', e);
  }
}

function showResolution(data) {
  resultDiv.innerHTML = `
    <h3>Resolution</h3>
    <p><strong>Instruction:</strong> ${data.instruction || 'N/A'}</p>
    <p><strong>Email Template:</strong> ${data.email_template || 'N/A'} 
      <button class="copy-btn" onclick="copyText(\`${data.email_template || ''}\`)">Copy</button>
    </p>
    <p><strong>Knowledge Base:</strong> <a href="${data.kb || '#'}" target="_blank">View Article</a></p>
    <p><strong>Related Cases:</strong> ${data.related_cases || 'None'}</p>
  `;
  resultDiv.classList.remove('hidden');
}

async function fetchFolder(path) {
  try {
    const url = `${basePath}/${path}`;
    const res = await fetch(url); // Will fail locally without a server
    // Simulate next options (You should use backend API or Node.js to list folders/files)
    return null; // Cannot dynamically list without backend
  } catch (err) {
    return null;
  }
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard!');
  });
}

function capitalize(str) {
  return str.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

window.onload = () => {
  createDropdown(['owner', 'member', 'unregistered'], 'requestor');
};
