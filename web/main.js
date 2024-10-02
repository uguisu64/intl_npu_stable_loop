// リストを追加する関数
function addList() {
    const container = document.getElementById("listContainer");
    const newList = document.createElement("div");
    newList.classList.add("list-item");
    newList.innerHTML = `<input type="text" name="item[]" placeholder="新しいリスト, アイテム1">
                         <button onclick="addItem(this)">アイテムを追加</button>`;
    container.appendChild(newList);
}

// アイテムを追加する関数
function addItem(button) {
    const listItem = button.parentNode;
    const newItem = document.createElement("input");
    newItem.type = "text";
    newItem.name = "item[]";
    newItem.placeholder = "新しいアイテム";
    listItem.insertBefore(newItem, button);
}

// データをPythonに送信する関数
function sendData() {
    const lists = [];
    document.querySelectorAll(".list-item").forEach(list => {
        const items = [];
        list.querySelectorAll("input[type='text']").forEach(input => {
            items.push(input.value);
        });
        lists.push(items);
    });
    
    // データをPythonに送信
    eel.receive_data(lists)(function(response) {
        alert(response);
    });
}

// フォームをリセットする関数
function resetForm() {
    const container = document.getElementById("listContainer");
    
    // すべてのリストを削除
    container.innerHTML = '';
    
    // 初期状態として、1つのリストを追加
    const initialList = document.createElement("div");
    initialList.classList.add("list-item");
    initialList.innerHTML = `<input type="text" name="item1[]" placeholder="リスト1, アイテム1">
                             <button onclick="addItem(this)">アイテムを追加</button>`;
    container.appendChild(initialList);
}

eel.expose(set_base64image);
function set_base64image(base64image) {
    document.getElementById("python_video").src = base64image;
}
