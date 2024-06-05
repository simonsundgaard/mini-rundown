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
                    updateArrows();
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
    newElement.style.border = `2px solid ${borderColor}`;
    newElement.style.display = 'flex';
    newElement.style.justifyContent = 'space-between';
    newElement.style.width = '100%';

    const textSpan = document.createElement('span');
    textSpan.style.width = '50%';
    textSpan.innerHTML = `<strong>${title}</strong>&nbsp;&nbsp;${subtitle}`;
    newElement.appendChild(textSpan);

    const arrowsContainer = document.createElement('div');
    arrowsContainer.className = 'arrowsContainer';

    const upArrow = document.createElement('button');
    upArrow.textContent = "⬆";
    upArrow.onclick = (event) => {
        event.stopPropagation();
        moveElement(newElement, -1);
    };

    const downArrow = document.createElement('button');
    downArrow.textContent = "⬇";
    downArrow.onclick = (event) => {
        event.stopPropagation();
        moveElement(newElement, 1);
    };

    arrowsContainer.appendChild(upArrow);
    arrowsContainer.appendChild(downArrow);
    newElement.appendChild(arrowsContainer);

    newElement.onclick = function() {
        this.remove();
        updateBorders();
        updateArrows();
    };

    container.appendChild(newElement); // Add new element to the bottom
    updateBorders();
}

function moveElement(element, direction) {
    const parent = element.parentElement;
    const index = Array.from(parent.children).indexOf(element);

    if (index + direction >= 0 && index + direction < parent.children.length) {
        const sibling = parent.children[index + direction];
        if (direction < 0) {
            parent.insertBefore(element, sibling);
        } else {
            parent.insertBefore(sibling, element);
        }
    }
    updateBorders();
    updateArrows();
}

function updateBorders() {
    const container = document.getElementById('elementsContainer');
    Array.from(container.children).forEach(child => {
        // Remove the class from all elements to ensure only the top-most has it
        child.classList.remove('top-most-element');
    });
    if (container.firstChild) {
        // Add the class only to the first child
        container.firstChild.classList.add('top-most-element');
    }
}



function updateArrows() {
    const container = document.getElementById('elementsContainer');
    Array.from(container.children).forEach((element, index) => {
        let arrowsContainer = element.getElementsByClassName('arrowsContainer')[0];
        arrowsContainer.innerHTML = ''; // Clear existing buttons

        if (index > 0) { // If not the first element, add an up arrow
            const upArrow = document.createElement('button');
            upArrow.textContent = "⬆";
            upArrow.className += 'large-arrow-button';
            upArrow.onclick = (event) => {
                event.stopPropagation();
                moveElement(element, -1);
            };
            arrowsContainer.appendChild(upArrow);
        }

        if (index < container.children.length - 1) { // If not the last element, add a down arrow
            const downArrow = document.createElement('button');
            downArrow.textContent = "⬇";
            downArrow.className += 'large-arrow-button';
            downArrow.onclick = (event) => {
                event.stopPropagation();
                moveElement(element, 1);
            };
            arrowsContainer.appendChild(downArrow);
        }
    });
}

function lightenColor(color, percent) {
    let num = parseInt(color.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        B = ((num >> 8) & 0x00FF) + amt,
        G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R : 255) * 0x10000 + (B < 255 ? B : 255) * 0x100 + (G < 255 ? G : 255)).toString(16).slice(1);
}
