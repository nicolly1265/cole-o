// Utilidades simples de armazenamento local
const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) { localStorage.removeItem(key); }
  };
  
  // Login simulado
  function initLogin() {
    const form = document.getElementById('loginForm');
    const userCard = document.getElementById('userCard');
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
  
    if (!form) return;
  
    const session = store.get('session', null);
    if (session?.username) {
      form.hidden = true;
      userCard.hidden = false;
      userName.textContent = session.username;
    }
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
  
      if (!username || !password) return;
      store.set('session', { username, vip: true });
      form.hidden = true;
      userCard.hidden = false;
      userName.textContent = username;
    });
  
    logoutBtn?.addEventListener('click', () => {
      store.remove('session');
      location.reload();
    });
  }
  
  // Favoritos locais
  function initFavorites() {
    const form = document.getElementById('favForm');
    const list = document.getElementById('favList');
    if (!form || !list) return;
  
    const render = () => {
      const favs = store.get('favorites', []);
      list.innerHTML = '';
      favs.forEach((f, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div>
            <strong>${f.name}</strong>
            <div class="item-meta">${f.category}</div>
          </div>
          <div class="item-actions">
            <button data-edit="${idx}">Editar</button>
            <button data-remove="${idx}">Remover</button>
          </div>
        `;
        list.appendChild(li);
      });
    };
    render();
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('favName').value.trim();
      const category = document.getElementById('favCategory').value;
      if (!name) return;
  
      const favs = store.get('favorites', []);
      favs.push({ name, category, createdAt: Date.now() });
      store.set('favorites', favs);
      form.reset();
      render();
    });
  
    list.addEventListener('click', (e) => {
      const editIdx = e.target.getAttribute('data-edit');
      const removeIdx = e.target.getAttribute('data-remove');
      if (removeIdx !== null) {
        const favs = store.get('favorites', []);
        favs.splice(Number(removeIdx), 1);
        store.set('favorites', favs);
        render();
      } else if (editIdx !== null) {
        const favs = store.get('favorites', []);
        const item = favs[Number(editIdx)];
        const newName = prompt('Novo nome do item:', item.name);
        if (newName && newName.trim()) {
          item.name = newName.trim();
          store.set('favorites', favs);
          render();
        }
      }
    });
  }
  
  // Comunidade: posts locais
  function initPosts() {
    const form = document.getElementById('postForm');
    const list = document.getElementById('postList');
    if (!form || !list) return;
  
    const render = () => {
      const posts = store.get('posts', []);
      list.innerHTML = '';
      if (posts.length === 0) {
        const empty = document.createElement('li');
        empty.textContent = 'Nenhum anúncio ainda. Publique o primeiro!';
        empty.style.color = '#aaa';
        list.appendChild(empty);
        return;
      }
      posts.slice().reverse().forEach((p, idx) => {
        const li = document.createElement('li');
        const price = p.type === 'venda' && p.price ? ` — R$ ${Number(p.price).toFixed(2)}` : '';
        li.innerHTML = `
          <div>
            <strong>${p.title}</strong>
            <div class="item-meta">${p.type.toUpperCase()}${price}</div>
            <div class="item-meta">${p.desc}</div>
          </div>
          <div class="item-actions">
            <button data-contact="${idx}">Contato</button>
            <button data-delete="${idx}">Excluir</button>
          </div>
        `;
        list.appendChild(li);
      });
    };
    render();
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('postTitle').value.trim();
      const type = document.getElementById('postType').value;
      const price = document.getElementById('postPrice').value;
      const desc = document.getElementById('postDesc').value.trim();
  
      if (!title || !desc) return;
      const posts = store.get('posts', []);
      posts.push({ title, type, price, desc, createdAt: Date.now() });
      store.set('posts', posts);
      form.reset();
      render();
    });
  
    list.addEventListener('click', (e) => {
      const contactIdx = e.target.getAttribute('data-contact');
      const deleteIdx = e.target.getAttribute('data-delete');
  
      if (contactIdx !== null) {
        alert('Para contato, habilite mensagens diretas no seu backend (simulação local).');
      } else if (deleteIdx !== null) {
        const posts = store.get('posts', []);
        // invert order in render, so delete needs index from original order
        const realIdx = posts.length - 1 - Number(deleteIdx);
        posts.splice(realIdx, 1);
        store.set('posts', posts);
        render();
      }
    });
  }
  
  // Assinatura simulada
  function initSubscription() {
    const btn = document.getElementById('subscribeBtn');
    if (!btn) return;
  
    btn.addEventListener('click', () => {
      alert('Assinatura VIP simulada. Integre com seu provedor de pagamento em produção.');
      const session = store.get('session', { username: 'visitante', vip: false });
      session.vip = true;
      store.set('session', session);
    });
  }
  
  // Inicialização
  document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initFavorites();
    initPosts();
    initSubscription();
  });
  