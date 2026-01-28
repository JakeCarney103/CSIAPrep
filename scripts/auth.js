function showPasswordGate() {
  const main = document.getElementById('main');
  main.innerHTML = `
    <div class="password-container">
      <h1>Tool Access</h1>

      <div class="block password-block">
        <p class="instruction">
          Enter the access password to continue.
        </p>

        <input
          type="password"
          id="pw"
          class="password-input"
          placeholder="Password"
          autocomplete="current-password"
        />

        <button id="loginBtn">Enter</button>

        <p class="password-error" style="display:none;"></p>
      </div>
    </div>
  `;

  // Shake animation helper
  function shakePasswordBlock() {
    const block = document.querySelector('.password-block');
    if (!block) return;
    block.classList.remove('shake');
    void block.offsetWidth; // force reflow
    block.classList.add('shake');
  }

  // Show inline error
  function showPasswordError(msg) {
    const errorEl = document.querySelector('.password-error');
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }

  // Clear error when typing
  document.getElementById('pw').addEventListener('input', () => {
    const errorEl = document.querySelector('.password-error');
    errorEl.style.display = 'none';
  });

  // Login button
  document.getElementById('loginBtn').onclick = async (e) => {
	e.preventDefault();
    const pw = document.getElementById('pw').value;
    const ok = await verifyPassword(pw);

    if (ok) {
      // Correct password: save auth and reload
      sessionStorage.setItem('auth', 'true');
      location.reload();
    } else {
      // Wrong password: shake and show error
      shakePasswordBlock();
      showPasswordError('Incorrect password. Try again!');
    }
  };
}

function shakePasswordBlock() {
  const block = document.querySelector('.password-block');
  if (!block) return;
  block.classList.remove('shake');
  void block.offsetWidth;
  block.classList.add('shake');
}

async function verifyPassword(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const hash = [...new Uint8Array(digest)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  return hash === '5c0d52abd9a9ecbe7bf08a7b55ce689a210ca31e8a1d652cf719ff23e4518cac';
}
