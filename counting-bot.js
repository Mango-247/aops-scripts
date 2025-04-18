var threshold = 99999999999,
	lastNumberFound = 0;
console.log("Threshold set to 999999999");
var logoImg = document.querySelector('.logo-img'),
	changeImage = function (newImageUrl)
	{
		logoImg.src = newImageUrl;
	},
	textElement = document.createElement('span');
textElement.textContent = "Counting Bot";
textElement.style.display = 'inline-block';
textElement.style.position = 'relative';
textElement.style.top = '10px';
textElement.style.left = '50px';
textElement.style.fontWeight = 'bold';
textElement.style.fontSize = 'larger';
var imageContainer = logoImg.parentNode;
imageContainer.appendChild(textElement);
var newImageUrl = 'https://avatar.artofproblemsolving.com/avatar_992185.png?t=1709587619';
changeImage(newImageUrl);
var hue = 0;
setInterval(function ()
{
	hue = (hue + 1) % 360;
	var rgb = hueToRgb(hue);
	textElement.style.color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}, 50);
setInterval(() =>
{
	const jumpToEndButton = document.querySelector('.cmty-topic-jump-bottom.clickable[title="Jump to end of topic"]');
	if (jumpToEndButton)
	{
		jumpToEndButton.click();
	}
}, 100);
alert("Welcome to Mango247's counting bot! Press \"P\" to pause the bot at any time! Press OK to start!");
var firstLoop = true,
	countingBotInterval, isPaused = false,
	secondsRemaining = 3,
	hasLoggedPaused = false,
	hasLoggedStarted = false;

function changeQuickReplyTextColor()
{
	const replyDiv = document.querySelector('.cmty-topic-mini-reply');
	if (replyDiv)
	{
		let hue = 0;
		const updateTextColor = () =>
		{
			const rgbColor = `rgb(${hueToRgb(hue).join(',')})`;
			replyDiv.style.color = rgbColor;
			hue = (hue + 1) % 360;
		};
		updateTextColor();
		setInterval(updateTextColor, 50);
	}
}

function hueToRgb(hue)
{
	const h = hue / 60,
		s = 1.0,
		v = 0.7,
		c = v * s,
		x = c * (1 - Math.abs(h % 2 - 1)),
		m = v - c;
	let rgb;
	if (h >= 0 && h < 1)
	{
		rgb = [c, x, 0];
	}
	else if (h >= 1 && h < 2)
	{
		rgb = [x, c, 0];
	}
	else if (h >= 2 && h < 3)
	{
		rgb = [0, c, x];
	}
	else if (h >= 3 && h < 4)
	{
		rgb = [0, x, c];
	}
	else if (h >= 4 && h < 5)
	{
		rgb = [x, 0, c];
	}
	else
	{
		rgb = [c, 0, x];
	}
	return [(rgb[0] + m) * 255, (rgb[1] + m) * 255, (rgb[2] + m) * 255];
}
changeQuickReplyTextColor();

function findElementByTextContent(text)
{
	var elements = document.getElementsByTagName('*');
	for (var i = 0; i < elements.length; i++)
	{
		if (elements[i].textContent === text)
		{
			return elements[i];
		}
	}
}

function pauseCountingBot()
{
	if (!isPaused && countingBotInterval)
	{
		isPaused = true;
		clearInterval(countingBotInterval);
		countingBotInterval = null;
		secondsRemaining = 33;
		if (!hasLoggedPaused)
		{
			console.log("Paused.");
			hasLoggedPaused = true;
		}
		alert("Counting bot paused. Press OK to resume.");
	}
}

function resumeCountingBot()
{
	if (isPaused)
	{
		isPaused = false;
		console.log("Resumed.");
		threshold = 75;
		console.log("Threshold set to 75 because resumed");
		countingBotInterval = setInterval(mainLoop, 30000);
	}
}

function runCountingBot()
{
	if (!isPaused)
	{
		if (firstLoop)
		{
			mainLoop();
			firstLoop = false;
		}
		countingBotInterval = setInterval(mainLoop, 30000);
	}
}

function checkAndStartBot()
{
	const okButton = document.querySelector('.aops-modal-btn.btn.btn-primary');
	if (!okButton)
	{
		if (!hasLoggedStarted)
		{
			console.log("Counting bot started.");
			hasLoggedStarted = true;
			isPaused = false;
		}
		runCountingBot();
		document.addEventListener('keydown', handleKeyPress);
	}
	else
	{
		setTimeout(checkAndStartBot, 100);
	}
}

function changeQuickReplyText()
{
	const replyDiv = document.querySelector('.cmty-topic-mini-reply');
	if (replyDiv)
	{
		const updateText = () =>
		{
			var welcomeMessageElement = findElementByTextContent("Press \"P\" to pause the bot at any time! Press OK to start the bot!");
			var pausedMessageElement = findElementByTextContent("Counting bot paused. Press OK to resume.");
			var welcomeMessage = welcomeMessageElement ? welcomeMessageElement.innerText : null;
			var pausedMessage = pausedMessageElement ? pausedMessageElement.innerText : null;
			if (pausedMessage !== null)
			{
				replyDiv.textContent = "Counting bot paused";
			}
			else if (!hasLoggedStarted)
			{
				replyDiv.textContent = "Waiting for the bot to start.";
			}
			else
			{
				const maxWidth = replyDiv.offsetWidth;
				if (secondsRemaining > 0)
				{
					resumeCountingBot();
					replyDiv.textContent = "Counting bot playing. Posting next number in approximately " + secondsRemaining + " seconds.";
					secondsRemaining--;
				}
				else
				{
					resumeCountingBot();
					replyDiv.textContent = "Counting bot playing. Posting next number in approximately 0 seconds.";
				}
			}
			replyDiv.style.fontWeight = "bold";
			replyDiv.style.textAlign = "center";
		};
		updateText();
		setInterval(updateText, 1000);
	}
}
changeQuickReplyText();

function handleKeyPress(event)
{
	if (event.key === 'p')
	{
		pauseCountingBot();
	}
}

function clickAndGoBack()
{
	if (!isPaused)
	{
		let closeButton = document.querySelector('div.aops-font[title=\"Close topic\"]');
		if (closeButton)
		{
			closeButton.click();
			setTimeout(() =>
			{
				window.history.back();
				setTimeout(() =>
				{
					const elements = document.querySelectorAll('.cmty-topic-jump-bottom');
					let maxBottom = 0,
						maxRight = 0,
						furthestElement = null;
					elements.forEach(element =>
					{
						const rect = element.getBoundingClientRect(),
							bottom = rect.bottom,
							right = rect.right;
						if (bottom >= maxBottom && right >= maxRight)
						{
							maxBottom = bottom, maxRight = right, furthestElement = element;
						}
					});
					furthestElement && furthestElement.click();
				}, 1e3);
			}, 1e3);
		}
	}
}

function mainLoop()
{
	if (isPaused)
	{
		return;
	}
	clickAndGoBack();
	setTimeout(() =>
	{
		let previousNumber = 0,
			found = true;
		let lastNumber = null,
			numberFound = false,
			latestNumberWithinThreshold = null,
			numbersOutsideThreshold = [];
		document.querySelectorAll('.cmty-post-html').forEach(post =>
		{
			let textContent = post.textContent,
				numbers = textContent.match(/\d+/g);
			numbers && numbers.forEach(num =>
			{
				const parsedNum = parseInt(num);
				lastNumber = parsedNum;
				numberFound = true;
				if (Math.abs(lastNumber - lastNumberFound) <= threshold)
				{
					latestNumberWithinThreshold = lastNumber;
				}
				else
				{
					numbersOutsideThreshold.push(lastNumber);
				}
			});
			let images = post.querySelectorAll('img');
			images.forEach(image =>
			{
				if (image.getAttribute('src') && image.getAttribute('src').startsWith('//latex'))
				{
					let numbersInAlt = image.alt.trim().match(/\d+/g);
					numbersInAlt && numbersInAlt.forEach(num =>
					{
						const parsedNum = parseInt(num);
						lastNumber = parsedNum;
						numberFound = true;
						if (Math.abs(lastNumber - lastNumberFound) <= threshold)
						{
							latestNumberWithinThreshold = lastNumber;
						}
						else
						{
							numbersOutsideThreshold.push(lastNumber);
						}
					});
				}
			});
		});
		if (numberFound)
		{
			if (latestNumberWithinThreshold !== null)
			{
				console.log('Found number ' + latestNumberWithinThreshold + ' posting number ' + (latestNumberWithinThreshold + 1));
				previousNumber = latestNumberWithinThreshold + 1;
				lastNumberFound = previousNumber;
				console.log("Updated LastNumberFound");
			}
			else
			{
				previousNumber++;
				console.log('No number within threshold found. Posting last number plus one');
			}
		}
		else
		{
			console.log('No number found. Posting last number plus one');
		}
		document.querySelector('.cmty-topic-reply')?.click();
		document.querySelector('.cmty-post-textarea') && (document.querySelector('.cmty-post-textarea').value = "[asy]size(3cm);pen[][]p={{red,orange,yellow,green,blue,purple}};latticeshade(texpath(\"" + previousNumber + "\"),p);[/asy]");
		document.querySelector('.cmty-submit-button')?.click();
		secondsRemaining = 29;
		threshold = 10;
		console.log("Threshold set to 10");
		if (numbersOutsideThreshold.length > 0)
		{
			console.log('Numbers outside threshold: ' + numbersOutsideThreshold.join(', '));
		}
	}, 3000);
}
setTimeout(checkAndStartBot, 250);
const pauseBotObserver = new MutationObserver(function (mutations)
{
	mutations.forEach(function (mutation)
	{
		const pauseBody = document.querySelector('.aops-modal-body');
		if (pauseBody && pauseBody.textContent.includes("Counting bot paused"))
		{
			isPaused = true;
			clearInterval(countingBotInterval);
			countingBotInterval = null;
			secondsRemaining = 30;
			if (!hasLoggedPaused)
			{
				console.log("Paused.");
				hasLoggedPaused = true;
			}
		}
		else if (isPaused === "waiting")
		{
			isPaused = false;
			countingBotInterval = setInterval(mainLoop, 30000);
		}
	});
});
pauseBotObserver.observe(document.body,
{
	childList: true,
	subtree: true
});
