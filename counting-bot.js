    // version 2.2

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
    text.textContent = 'Counting Bot';
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
    button.addEventListener('click', startBot);
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

    let last_num = 0;
    let eta = 3
    let posts_added = 0;
    let lastNumLabel = document.createElement('div');
    let postsLabel = document.createElement('div');
    let note = document.createElement('div');
    let note2 = document.createElement('div');
    let eta_note = document.createElement('div');
    let on_off_switch = document.createElement('button');
    let isEnabled = false;


    function help() {
        alert('To use this counting bot, click on the topic you want to count in, and copy the link you are on. It should look something like https://artofproblemsolving.com/community/c1234h5678. Just copy this into the "link to thread" input and click start. If you need more help or want to report a bug please send a PM to Mango247.')
    }


    async function post(id, text) {
        const url = "https://artofproblemsolving.com/m/community/ajax.php";
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Origin": "https://artofproblemsolving.com",
            "Referer": "https://artofproblemsolving.com/",
            "X-Requested-With": "XMLHttpRequest"
        };

        const payload = new URLSearchParams({
            attachments: JSON.stringify([]),
            post_text: text,
            notify_email: "0",
            topic_id: id,
            allow_latex_errors: "0",
            last_post_num: "0",
            last_update_time: "0",
            disable_bbcode: "0",
            is_announcement: "0",
            a: "submit_post",
            aops_logged_in: "true",
            aops_user_id: AoPS.session.user_id,
            aops_session_id: AoPS.session.id
        });

        try {
            const response = await fetch(url, { method: "POST", headers: headers, body: payload });
            const result = await response.json();
            if (result.error_code) {return false}
            return true;
        } catch (error) {
            return false
        }
    }

    async function get_last_number(topic_id) {
        const response = await fetch("https://artofproblemsolving.com/m/community/ajax.php", {
            headers: {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            referrer: "https://artofproblemsolving.com/",
            referrerPolicy: "origin",
            body: `topic_id=${topic_id}&direction=backwards&start_post_id=-1&start_post_num=9999999&show_from_time=-1&num_to_fetch=5&a=fetch_posts_for_topic&aops_logged_in=true&aops_user_id=${AoPS.session.id}&aops_session_id=${AoPS.session.id}`,
            method: "POST",
            mode: "cors",
            credentials: "include"
        });

        const data = await response.json();
        const posts = data?.response?.posts;

        if (!Array.isArray(posts)) return 0;

        const numberToLastIndex = new Map(); // number -> last post index
        const numberSet = new Set();

        for (let i = 0; i < posts.length; i++) {
            const content = posts[i].post_canonical || '';
            const numbers = content.split(/\D+/).filter(Boolean).map(n => parseInt(n, 10));
            for (const num of numbers) {
                numberSet.add(num);
                numberToLastIndex.set(num, i); // update with last occurrence
            }
        }

        const numberMap = Array.from(numberSet).sort((a, b) => a - b);

        let sequences = [];
        let current = [];

        for (let i = 0; i < numberMap.length; i++) {
            if (current.length === 0 || numberMap[i] === current[current.length - 1] + 1) {
                current.push(numberMap[i]);
            } else {
                sequences.push([...current]);
                current = [numberMap[i]];
            }
        }
        if (current.length) sequences.push([...current]);

        // Select the best sequence
        let best = sequences[0] || [];
        for (let seq of sequences) {
            if (seq.length > best.length) {
                best = seq;
            } else if (seq.length === best.length) {
                const lastIndexBest = numberToLastIndex.get(Math.max(...best));
                const lastIndexSeq = numberToLastIndex.get(Math.max(...seq));
                if (lastIndexSeq > lastIndexBest) {
                    best = seq;
                }
            }
        }

        return best.length ? Math.max(...best) : 0;;
    }

    async function post_alot(topic_id) {
        let pending = false;
        while (true) {
            last_num = await get_last_number(topic_id);
            lastNumLabel.textContent = `Last Number: ${last_num}`;
            if (!isEnabled) {
                await new Promise(resolve => setTimeout(resolve, 50));
                return post_alot(topic_id);
            }

            eta = Math.max(0, eta - 1);
            eta_note.textContent = `Posting next number in ≈ ${eta} seconds`;

            if (!pending) {
                pending = true;
                post(topic_id, `[asy]size(2cm); pen[][]p={{red,orange,yellow,green,blue,purple}}; latticeshade(texpath("${last_num+1}"),p);[/asy]`)
                    .then(result => {
                    if (result) {
                        eta = 25;
                        posts_added++;
                        lastNumLabel.textContent = `Last Number: ${last_num + 1}`;
                        postsLabel.textContent = `Posts Made: ${posts_added}`;
                        eta_note.textContent = `Posted!`;
                        pending = false;
                    }
                });
            }



            await new Promise(resolve => setTimeout(resolve, 1000));

        }

    }

    async function startBot() {
        const url = input.value;
        console.log(url)
        const match = url.match(/^https?:\/\/artofproblemsolving\.com\/community\/c\d+h(\d+)/);
        if (match) {
            input.remove()
            button.remove()
            otherButton.style.margin = '14px 0';

            const topic_id = match[1];
            console.log("topic_id:", topic_id);

            box.style.height = "260px"
            box.style.background = 'linear-gradient(to bottom, #1b365d 0px, #1b365d 30px, #009fad 30px, #009fad 110px, #000000 110px, #000000 112px, #009fad 112px, #009fad 170px, #000000 170px, #000000 172px, #009fad 172px, #009fad 230px, #000000 230px, #000000 232px,  #9f9f9f 232px)';

            on_off_switch.style.display = 'flex';
            on_off_switch.style.textAlign = 'center';
            on_off_switch.style.alignItems = 'center';
            on_off_switch.style.flexDirection = 'column';
            on_off_switch.style.margin = '27px auto 0px auto';
            on_off_switch.style.padding = '10px 20px';
            on_off_switch.style.border = 'none';
            on_off_switch.style.borderRadius = '5px';
            on_off_switch.style.cursor = 'pointer';
            on_off_switch.style.color = 'white';
            on_off_switch.style.fontWeight = 'bold';

            on_off_switch.style.width = '150px';
            on_off_switch.style.height = '35px';

            function updateButton() {
                if (isEnabled) {
                    on_off_switch.textContent = 'Enabled';
                    on_off_switch.style.backgroundColor = 'green';
                } else {
                    on_off_switch.textContent = 'Paused';
                    on_off_switch.style.backgroundColor = 'red';
                }
            }

            updateButton();

            on_off_switch.addEventListener('click', () => {
                isEnabled = !isEnabled;
                updateButton();
            });


            box.insertBefore(on_off_switch, box.children[1]);

            note2.textContent = 'Posts may take a minute to appear';
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
            note.style.margin = '28px 0 0 0';
            box.insertBefore(note, box.children[1]);

            eta_note.textContent = `Posting next number in ≈ 3 seconds`;
            eta_note.style.fontSize = '12px';
            eta_note.style.fontWeight = 'bold';
            eta_note.style.color = '#ffffff';
            eta_note.style.textAlign = 'center';
            eta_note.style.lineHeight = '10px';
            eta_note.style.margin = '15px 0 0 0';
            box.insertBefore(eta_note, box.children[1]);

            postsLabel.textContent = `Posts Made: 0`;
            postsLabel.style.fontSize = '20px';
            postsLabel.style.fontWeight = 'bold';
            postsLabel.style.color = '#ffe338';
            postsLabel.style.textAlign = 'center';
            postsLabel.style.lineHeight = '10px';
            postsLabel.style.margin = '10px 0 0 0';
            box.insertBefore(postsLabel, box.children[1]);

            lastNumLabel.textContent = 'Last Number: 0';
            lastNumLabel.style.fontSize = '20px';
            lastNumLabel.style.fontWeight = 'bold';
            lastNumLabel.style.color = '#55ff55';
            lastNumLabel.style.textAlign = 'center';
            lastNumLabel.style.lineHeight = '10px';
            lastNumLabel.style.margin = '24px 0 0 0';
            box.insertBefore(lastNumLabel, box.children[1]);


            lastNumLabel.textContent = `Last Number: ${last_num}`;

            post_alot(topic_id);
        } else {
            alert('You entered an invalid topic url. If you need help or think this is a bug click the "Help / Report a Bug" button.')
        }
    }
