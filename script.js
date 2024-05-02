document.addEventListener('DOMContentLoaded', function() {
    fetch('buttons.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('buttonsContainer');
            data.forEach(button => {
                const newButton = document.createElement('button');
                newButton.innerHTML = `<strong>${button.title}</strong><br>${button.subtitle}`;
                newButton.style.backgroundColor = button.backgroundColor;
                newButton.style.color = button.textColor;
                newButton.style.border = `1px solid ${button.borderColor}`;

                const originalColor = button.backgroundColor;
                const hoverColor = lightenColor(originalColor, 20);
                newButton.onmouseover = () => newButton.style.backgroundColor = hoverColor;
                newButton.onmouseleave = () => newButton.style.backgroundColor = originalColor;

                newButton.onclick = function() {
                    if (button.isCustom) {
                        const customText = prompt("Enter your custom text:");
                        if (customText) {
                            addElement(customText, "", button.backgroundColor, button.textColor, button.borderColor);
                        }
                    } else {
                        addElement(button.title, button.subtitle, button.backgroundColor, button.textColor, button.borderColor);
                    }
                };

                container.appendChild(newButton);
            });
        })
        .catch(error => console.error('Error loading the buttons:', error));
});

function addElement(title, subtitle, backgroundColor, textColor, borderColor) {
    const container = document.getElementById('elementsContainer');
    const newElement = document.createElement('div');
    newElement.style.background = backgroundColor;
    newElement.style.color = textColor;
    newElement.style.border = `1px solid ${borderColor}`;
    newElement.style.display = 'flex'; /* Flex display for easier layout management */
    newElement.style.justifyContent = 'space-between'; /* Spread elements across */
    newElement.style.width = '100%'; /* Full width */

    // Text span
    const textSpan = document.createElement('span');
    textSpan.style.width = '50%';
    textSpan.innerHTML = `<strong>${title}</strong>&nbsp&nbsp${subtitle}`;
    newElement.appendChild(textSpan);

    // Container for arrows
    const arrowsContainer = document.createElement('div');
    arrowsContainer.className = 'arrowsContainer';

    const upArrow = document.createElement('button');
    upArrow.textContent = "⬆"; /* Unicode arrow up */
    upArrow.onclick = (event) => {
        event.stopPropagation(); // Prevent triggering the parent element's click
        moveElement(newElement, -1);
    };

    const downArrow = document.createElement('button');
    downArrow.textContent = "⬇"; /* Unicode arrow down */
    downArrow.onclick = (event) => {
        event.stopPropagation(); // Prevent triggering the parent element's click
        moveElement(newElement, 1);
    };

    // Add arrows to container
    arrowsContainer.appendChild(upArrow);
    arrowsContainer.appendChild(downArrow);

    // Append arrows container to element
    newElement.appendChild(arrowsContainer);

    newElement.onclick = function() {
        this.remove();
    };

    container.appendChild(newElement);
}

function moveElement(element, direction) {
    const parent = element.parentElement;
    const index = Array.from(parent.children).indexOf(element);

    if (index + direction >= 0 && index + direction < parent.children.length) {
        const sibling = parent.children[index + direction];
        if (direction < 0) {
            parent.insertBefore(element, sibling); // Move up
        } else {
            parent.insertBefore(sibling, element); // Move down
        }
    }
}

function lightenColor(color, percent) {
    let num = parseInt(color.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        B = ((num >> 8) & 0x00FF) + amt,
        G = (num & 0x0000FF) + amt;

    return "#" + (0x1000000 + (R < 255 ? R : 255) * 0x10000 + (B < 255 ? B : 255) * 0x100 + (G < 255 ? G : 255)).toString(16).slice(1);
}
