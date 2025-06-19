// version 2.2

alert("Decommissioned since I can't get postbanned again. Sorry.")
throw new Error("Hey There");

///////////////////////////////////////////////////////////////// Create Box /////////////////////////////////////////////////////////////////

const box = document.createElement('div');
box.style.position = 'fixed';
box.style.width = '250px';
box.style.height = '180px';
box.style.padding = '10px';
box.style.background = 'linear-gradient(to bottom, #1b365d 0px, #1b365d 30px, #009fad 30px, #009fad 150px, #000000 150px, #000000 152px, #9f9f9f 152px)';
box.style.border = '3px solid black';
box.style.borderRadius = '10px';
box.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
box.style.zIndex = '100001';
box.style.cursor = 'move';
box.style.userSelect = 'none';
box.style.transform = 'translateZ(0)';
document.body.appendChild(box);

const boxWidth = 250;
const boxHeight = 140;

box.style.left = `${(window.innerWidth - boxWidth) / 2}px`;
box.style.top = `${(window.innerHeight - boxHeight) / 2}px`;

let isDragging = false;
let offsetX, offsetY;

box.addEventListener('mousedown', (e) => {
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
text.textContent = 'View Bot';
text.style.fontSize = '24px';
text.style.fontWeight = 'bold';
text.style.color = '#ffffff';
text.style.textAlign = 'center';
text.style.lineHeight = '10px';
box.appendChild(text);

///////////////////////////////////////////////////////////////// Put Stuff In Box /////////////////////////////////////////////////////////////////

const input = document.createElement('input');
input.placeholder = 'Enter Link to Topic';
input.style.width = '100%';
input.style.margin = '30px auto 0 auto';
input.style.padding = '5px';
input.style.borderRadius = '10px';
input.style.border = 'none';
input.style.boxSizing = 'border-box';
input.style.textAlign = 'center';
input.style.fontWeight = 'bold';
input.style.color = 'black';
input.style.outline = '2px solid #1b365d';
input.addEventListener('focus', () => input.style.outline = '2px solid black');
input.addEventListener('blur', () => input.style.outline = '2px solid #1b365d');
box.appendChild(input);

const button = document.createElement('button');
button.textContent = "START";
button.style.width = '130px';
button.style.height = '30px';
button.style.backgroundColor = '#000';
button.style.color = '#FFF';
button.style.border = 'none';
button.style.borderRadius = '10px';
button.style.cursor = 'pointer';
button.style.margin = '20px auto 0 auto';
button.style.display = 'block';
button.style.fontWeight = 'bold';
button.addEventListener('click', viewBot);
box.appendChild(button);

const otherButton = document.createElement('button');
otherButton.textContent = "Help / Report a Bug";
otherButton.style.width = '235px';
otherButton.style.height = '22px';
otherButton.style.backgroundColor = '#9f9f9f';
otherButton.style.color = 'black';
otherButton.style.border = 'none';
otherButton.style.cursor = 'pointer';
otherButton.style.margin = '24px 0';
otherButton.style.display = 'block';
otherButton.style.fontWeight = 'bold';

otherButton.style.position = 'relative';
otherButton.style.left = '50%';
otherButton.style.transform = 'translateX(-50%)';

otherButton.addEventListener('click', help);
box.appendChild(otherButton);

/////////////////////////////////////////////////////// Code To Make The Box Actually Do Stuff Instead Of Just Looking Like It Does Stuff ///////////////////////////////////////////////////////

let views_added = 0
let views = 0;
let total_views = 0;
let speed = 1;
let lastIncreaseTime = 0;
let activeRequests = 0;
let progressLabel = document.createElement('div');
let totalLabel = document.createElement('div');
let note = document.createElement('div');
let note2 = document.createElement('div');
const sliderContainer = document.createElement('div');

let delay = 3; // Default delay for probing
const max_delay = 1000;
let decrease_factor = 0.999;
const increase_factor = 1.1;

const abortControllers = [];

function help() {
    alert('To use this view bot, click on the topic you want to add views to, and copy the link you are on. It should look something like https://artofproblemsolving.com/community/c1234h5678. Just copy this into the "link to thread" input and click start. If you need more help or want to report a bug please send a PM to Mango247.')
}

function view(topic_id, controller) {
    return fetch("https://artofproblemsolving.com/m/community/ajax.php", {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        referrer: "https://artofproblemsolving.com/",
        referrerPolicy: "origin",
        body: `topic_fetch=update&update=&new_topic_id=${topic_id}&new_category_id=1&last_post_num=523&last_update_time=1746236353&old_topic_id=3560361&source=master&hash=3040100&is_office_hours=0&a=change_focus_topic&aops_logged_in=true&aops_session_id=${AoPS.session.id}`,
        mode: "cors",
        credentials: "include",
        signal: controller.signal
    });
}


let running = false;

async function spamViews(topic_id) {
    if (running) return;
    running = true;

    while (running) {
        if (speed === 1) {
            await new Promise(resolve => setTimeout(resolve, 100));
            continue;
        }

        const controller = new AbortController();
        abortControllers.push(controller);

        const sendRequest = async () => {
            activeRequests++;
            try {
                const response = await view(topic_id, controller);
                const data = await response.json();

                total_views = parseInt(data.response.topic_update_data.num_views);
                views_added ++;
                progressLabel.textContent = `Views Added: ${views_added}`;
                totalLabel.textContent = `Total Views: ${total_views}`;

                if (speed === 5) {
                    delay = delay * decrease_factor;
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error("View failed:", error);
                    if (speed === 5) {
                        const now = Date.now();
                        if (now - lastIncreaseTime >= 500) {
                            decrease_factor = 1;
                            delay = Math.min(delay * increase_factor, max_delay);
                            lastIncreaseTime = now;
                        }
                    }
                }
            } finally {
                activeRequests--;
            }
        };

        if (speed === 2) {
            await new Promise(resolve => setTimeout(resolve, 300));
            await sendRequest();
        } else if (speed === 3) {
            while (activeRequests < 3) {
                sendRequest();
            }
            await new Promise(resolve => setTimeout(resolve, 1));
        } else if (speed === 4) {
            while (activeRequests < 8) {
                sendRequest();
            }
            await new Promise(resolve => setTimeout(resolve, 1));
        } else if (speed === 5) {
            while (activeRequests < 30) {
                sendRequest();
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        } else {
            await new Promise(resolve => setTimeout(resolve, 1));
        }
    }
}





async function viewBot() {
    const url = input.value;
    console.log(url)
    const match = url.match(/^https?:\/\/artofproblemsolving\.com\/community\/c\d+h(\d+)/);
    if (match) {
        input.remove()
        button.remove()
        otherButton.style.margin = '9px 0';

        const topic_id = match[1];
        console.log("topic_id:", topic_id);

        box.style.height = "243px"
        box.style.background = 'linear-gradient(to bottom, #1b365d 0px, #1b365d 30px, #009fad 30px, #009fad 90px, #000000 90px, #000000 92px, #009fad 92px, #009fad 150px, #000000 150px, #000000 152px, #009fad 152px, #009fad 212px, #000000 212px, #000000 214px,  #9f9f9f 212px, #9f9f9f 243px)';

        box.insertBefore(sliderContainer, box.children[1]);
        sliderContainer.style.display = 'flex';
        sliderContainer.style.textAlign = 'center';
        sliderContainer.style.alignItems = 'center';
        sliderContainer.style.flexDirection = 'column';
        sliderContainer.style.margin = '14px 0px 0px 0px';
        
        sliderContainer.innerHTML = `
            <span id="speed-label" style="font-weight:bold; margin-top: 5px; margin-bottom: -3px;">Speed: ${speed}</span>
            <div id="speed-message" style="font-size: 14px; font-weight: normal; margin-top: 0px; margin-bottom: 0px;">Paused</div>
            <input type="range" id="speed-slider" min="1" max="5" value="${speed}" style="width:150px; flex-shrink:0; accent-color: #1b365d; margin-top: -3px;" /> 
        `;

        
        const slider = document.getElementById('speed-slider');
        const speedLabel = document.getElementById('speed-label');
        const messageDiv = document.getElementById('speed-message');
        
        function updateMessage() {
            switch (speed) {
                case 1: messageDiv.textContent = 'Paused'; break;
                case 2: messageDiv.textContent = 'For getting an exact number'; break;
                case 3: messageDiv.textContent = '"I need all my memory!"'; break;
                case 4: messageDiv.textContent = '"You can have some memory ig"'; break;
                case 5: messageDiv.textContent = '"Idc if you use 50% of my memory"'; break;
                default: messageDiv.textContent = ''; break;
            }
        }
        speedLabel.textContent = `Speed: ${slider.value}`;

        updateMessage();


        
        slider.addEventListener('input', () => {
            speed = parseInt(slider.value, 10);
            speedLabel.textContent = `Speed: ${speed}`;
            updateMessage();
        });


        note2.textContent = 'Views will only be visible after refreshing';
        note2.style.fontSize = '12px';
        note2.style.fontWeight = 'bold';
        note2.style.color = '#ffffff';
        note2.style.textAlign = 'center';
        note2.style.lineHeight = '10px';
        note2.style.margin = '9px 0 0 0';
        box.insertBefore(note2, box.children[1]);

        note.textContent = 'Refresh page to stop';
        note.style.fontSize = '20px';
        note.style.fontWeight = 'bold';
        note.style.color = '#ffffff';
        note.style.textAlign = 'center';
        note.style.lineHeight = '10px';
        note.style.margin = '33px 0 0 0';
        box.insertBefore(note, box.children[1]);

        totalLabel.textContent = `Total Views: 0`;
        totalLabel.style.fontSize = '20px';
        totalLabel.style.fontWeight = 'bold';
        totalLabel.style.color = '#ffe338';
        totalLabel.style.textAlign = 'center';
        totalLabel.style.lineHeight = '10px';
        totalLabel.style.margin = '10px 0 0 0';
        box.insertBefore(totalLabel, box.children[1]);

        progressLabel.textContent = 'Views Added: 0';
        progressLabel.style.fontSize = '20px';
        progressLabel.style.fontWeight = 'bold';
        progressLabel.style.color = '#55ff55';
        progressLabel.style.textAlign = 'center';
        progressLabel.style.lineHeight = '10px';
        progressLabel.style.margin = '24px 0 0 0';
        box.insertBefore(progressLabel, box.children[1]);

        const starting_views = (await (await view(topic_id, new AbortController())).json()).response.topic_update_data.num_views;
        totalLabel.textContent = `Total Views: ${starting_views}`;

        spamViews(topic_id);
    } else {
        alert('You entered an invalid topic url. If you need help or think this is a bug click the "Help / Report a Bug" button.')
    }
}
