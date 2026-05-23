function addItem() {
    const itemInput = document.getElementById("itemInput");
    const item = itemInput.value.trim();
    if (item !== "") {
        const itemList = document.getElementById("itemList");
        const listItem = document.createElement("div");
        listItem.className="ellement-section";
        listItem.innerHTML = `
            <div class="item-name" onclick="renameItem(this)">${item}</div>
            <div class="item-counter">
                <button type="button" onclick="updateQuantity(this)" class="dec-button disabled-btn" data-tooltip="зменшити кількість" disabled>-</button>
                <input type="number" value="1" class="quantity-input" readonly>
                <button type="button" onclick="updateQuantity(this)" class="inc-button" data-tooltip="збільшити кількість">+</button>
            </div>
            <div class="item-actions">
                <button type="button" onclick="toggleStatus(this.parentNode.parentNode)" class="status-button" data-tooltip="позначити як куплено">Куплено</button>
                <button type="button" onclick="deleteItem(this.parentNode.parentNode)" class="decline-button" data-tooltip="видалити товар">x</button>
            </div>
        `;
        itemList.appendChild(listItem);
        itemInput.value = "";
        itemInput.focus();
        updateStatistics();
    }
}
function deleteItem(item) {
    item.remove();
    updateStatistics();
}
function toggleStatus(item) {
    const quantityInput = item.querySelector('.quantity-input').value;
    if (item.querySelector('.item-name').classList.contains("bought")) {
        item.classList.remove("bought");
        item.innerHTML = `
            <div class="item-name" onclick="renameItem(this)">${item.querySelector('.item-name').textContent}</div>
            <div class="item-counter">
                <button type="button" onclick="updateQuantity(this)" class="dec-button ${quantityInput <= 1 ? 'disabled-btn' : ''}" data-tooltip="зменшити кількість" ${quantityInput <= 1 ? 'disabled' : ''}>-</button>
                <input type="number" value="${quantityInput}" class="quantity-input" readonly>
                <button type="button" onclick="updateQuantity(this)" class="inc-button" data-tooltip="збільшити кількість">+</button>
            </div>
            <div class="item-actions">
                <button type="button" onclick="toggleStatus(this.parentNode.parentNode)" class="status-button" data-tooltip="позначити як куплено">Куплено</button>
                <button type="button" onclick="deleteItem(this.parentNode.parentNode)" class="decline-button" data-tooltip="видалити товар">x</button>
            </div>`;
    } else {
        item.innerHTML = `
            <div class="item-name bought">${item.querySelector('.item-name').textContent}</div>
            <div class="item-counter">
                <input type="number" value="${quantityInput}" class="quantity-input" readonly>
            </div>
            <div class="item-actions">
                <button type="button" onclick="toggleStatus(this.parentNode.parentNode)" class="status-button" data-tooltip="позначити як не куплено">Не куплено</button>
            </div>`;
    }
        updateStatistics();
}
function updateQuantity(button) {
    const quantityInput = button.parentNode.querySelector('.quantity-input');
    const currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + (button.classList.contains('inc-button') && !button.classList.contains('disabled-btn') ? 1 : -1);
    const decButton = button.parentNode.parentNode.querySelector('.dec-button');
    if(currentValue == 2 && button.classList.contains('dec-button')) {
        decButton.classList.add('disabled-btn');
        decButton.disabled = true;
    }
    else if(quantityInput.value > 1){
        decButton.classList.remove('disabled-btn');
        decButton.disabled = false;
    }
        updateStatistics();
}
function renameItem(item) {
    item.innerHTML = `<input type="text" data-old-value="${item.textContent}" value="${item.textContent}" class="edit-input" onblur="saveItem(this, this.dataset.oldValue)" onkeydown="if(event.key === 'Enter') { this.blur(); }">`;
    item.querySelector('.edit-input').focus();
    item.querySelector('.edit-input').setSelectionRange(item.querySelector('.edit-input').value.length, item.querySelector('.edit-input').value.length);
}
function saveItem(input, oldValue) {
    const newName = input.value.trim();
    if (newName !== "") {
        input.parentNode.textContent = newName;
    } else {
        input.parentNode.textContent = oldValue;
    }
    updateStatistics();
}
function updateStatistics() {
    const leftPanelTags = document.querySelectorAll('.summary-tags');
    const remainingContainer = leftPanelTags[0];
    const boughtContainer = leftPanelTags[1];    
    remainingContainer.innerHTML = '';
    boughtContainer.innerHTML = '';
    const allItems = document.querySelectorAll('#itemList .ellement-section');
 
    allItems.forEach(function(item) {
        const nameDiv = item.querySelector('.item-name');
        const name = nameDiv.querySelector('input') ? nameDiv.querySelector('input').value : nameDiv.textContent.trim();
        const quantity = item.querySelector('.quantity-input').value;
        const statusButton = item.querySelector('.status-button');
        const isBought = statusButton.textContent.trim() === "Не куплено"; 
        const tagHTML = `
            <div class="product-tag">
                <span class="tag-name ${isBought ? 'bought' : ''}">${name}</span>
                <span class="tag-count">${quantity}</span>
            </div>
        `;
        if (isBought) {
            boughtContainer.innerHTML += tagHTML;
        } else {
            remainingContainer.innerHTML += tagHTML;
        }
    });
}