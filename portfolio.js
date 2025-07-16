
  const menuToggle = document.createElement('div');
  menuToggle.classList.add('menu-toggle');
  menuToggle.innerHTML = `
    <div></div>
    <div></div>
    <div></div>
  `;
  document.querySelector('.nav-container').appendChild(menuToggle);

  const navLinks = document.querySelector('.nav-links');
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

