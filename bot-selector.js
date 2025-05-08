// Version 1.4

///////////////////////////////////////////////////////////////// Fetch JS Files and Create Box /////////////////////////////////////////////////////////////////

fetch('https://api.github.com/repos/Mango-247/aops-scripts/contents?ref=main')
  .then(response => response.json())
  .then(data => {
    const jsFiles = data.filter(file => file.name.endsWith('.js')).map(file => file.name);

    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.width = '250px';
    box.style.minHeight = '100px';
    box.style.padding = '10px';
    box.style.border = '3px solid black';
    box.style.borderRadius = '10px';
    box.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    box.style.zIndex = '100001';
    box.style.cursor = 'move';
    box.style.userSelect = 'none';
    box.style.transform = 'translateZ(0)';
    box.style.display = 'flex';
    box.style.flexDirection = 'column';
    box.style.justifyContent = 'flex-start';
    box.style.height = 'auto';
    document.body.appendChild(box);

    const boxWidth = 250;
    box.style.left = `${(window.innerWidth - boxWidth) / 2}px`;
    box.style.top = `${(window.innerHeight - 180) / 2}px`;

    let isDragging = false;
    let offsetX, offsetY;

    box.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        const isInteractive = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(e.target.tagName) || e.target.isContentEditable;
        if (!isInteractive) {
            isDragging = true;
            const rect = box.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            box.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            box.style.left = `${newLeft}px`;
            box.style.top = `${newTop}px`;
            ensureWithinBounds();
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            box.style.cursor = 'move';
            document.body.style.userSelect = 'auto';
        }
    });

    function ensureWithinBounds() {
        const rect = box.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let left = parseFloat(box.style.left);
        let top = parseFloat(box.style.top);

        if (left < 0) left = 0;
        else if (left + rect.width > vw) left = vw - rect.width;

        if (top < 0) top = 0;
        else if (top + rect.height > vh) top = vh - rect.height;

        box.style.left = `${left}px`;
        box.style.top = `${top}px`;
    }

    const text = document.createElement('div');
    text.textContent = 'Bot Selector';
    text.style.fontSize = '24px';
    text.style.fontWeight = 'bold';
    text.style.color = '#ffffff';
    text.style.textAlign = 'center';
    text.style.lineHeight = '10px';
    text.style.marginBottom = '10px';
    box.appendChild(text);
      
    /////////////////////////////////////////////////////////////////// Add File Buttons /////////////////////////////////////////////////////////////////

    jsFiles.forEach(file => {
        const fileButton = document.createElement('button');
        fileButton.textContent = "Run "+file.replace(/-/g, " ").replace(/\.js$/, "");
        fileButton.style.width = '235px';
        fileButton.style.height = '22px';
        fileButton.style.backgroundColor = 'rgb(14, 107, 133)';
        fileButton.style.color = 'black';
        fileButton.style.border = '2px solid black';
        fileButton.style.borderRadius = '5px';
        fileButton.style.cursor = 'pointer';
        fileButton.style.margin = '10px 0';
        fileButton.style.fontWeight = 'bold';
        fileButton.style.position = 'relative';
        fileButton.style.left = '50%';
        fileButton.style.transform = 'translateX(-50%)';
        fileButton.style.display = 'flex';
        fileButton.style.alignItems = 'center';
        fileButton.style.justifyContent = 'center'; 


        fileButton.addEventListener('click', () => {
            box.remove()
            fetch(`https://cdn.jsdelivr.net/gh/Mango-247/aops-scripts@main/${file}`)
              .then(response => response.text())
              .then(text => {
                eval(text)
              });
        });

        box.appendChild(fileButton);
    });

    /////////////////////////////////////////////////////////////////// Help Button (at the bottom) /////////////////////////////////////////////////////////////////

    const helpButton = document.createElement('button');
    helpButton.textContent = "Help / Report a Bug";
    helpButton.style.width = '235px';
    helpButton.style.height = '22px';
    helpButton.style.backgroundColor = '#9f9f9f';
    helpButton.style.color = 'black';
    helpButton.style.border = 'none';
    helpButton.style.cursor = 'pointer';
    helpButton.style.margin = '15px 0 0 0';
    helpButton.style.display = 'block';
    helpButton.style.fontWeight = 'bold';
    helpButton.style.position = 'relative';
    helpButton.style.left = '50%';
    helpButton.style.transform = 'translateX(-50%)';

    helpButton.addEventListener('click', () => {
        alert('To use this bot selector, simply click the script you wish to run. If you want to report a bug, please PM Mango247.');
    });

    box.appendChild(helpButton);

    /////////////////////////////////////////////////////////////////// Final Gradient Update /////////////////////////////////////////////////////////////////

    requestAnimationFrame(() => {
        const autoHeight = box.offsetHeight;
         box.style.height = `${autoHeight - 10}px`;
        
        const h = box.offsetHeight;
        box.style.background = `linear-gradient(to bottom, #1b365d 0px, #1b365d 30px, #009fad 30px, #009fad ${h - 30}px, #000000 ${h - 30}px, #000000 ${h - 28}px, #9f9f9f ${h - 28}px)`;
    });
});
