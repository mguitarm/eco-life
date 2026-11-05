// 1. Находим нашу кнопку по её ID
const themeButton = document.getElementById('themeBtn');
// 2. Вешаем слушатель события клик
themeButton.addEventListener('click', function() {
    // 3. Переключаем класс dark-theme на самом верхнем уровне — у тега body
    document.body.classList.toggle('dark-theme');
    // 4. Логическое задание: Меняем текст на кнопке в зависимости от темы
    if (document.body.classList.contains('dark-theme')) {
        themeButton.textContent = '☀ Светлая тема';
        } else {
            themeButton.textContent = '🌙 Темная тема';
        }
});


// Находим ВСЕ кнопки лайков на странице
const likeButtons = document.querySelectorAll('.like-btn');
likeButtons.forEach(function(button) {button.addEventListener('click', function() {
    // Находим спан со счетчиком именно внутри этой нажатой кнопки
    const countSpan = button.querySelector('.likecount');
    // Превращаем текст в число и увеличиваем на 1
    let currentLikes = parseInt(countSpan.textContent);
    currentLikes++;
    // Записываем новое значение обратно 
    countSpan.textContent = currentLikes;
    // Визуальный эффект: подсветим кнопку при клике
    button.style.backgroundColor = '#e74c3c';
    button.style.color = 'white';
    });
});


const readMoreButtons = document.querySelectorAll('.read-more-btn');
readMoreButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
        // Находим текст, который идет ровно перед этой кнопкой
        const textBlock = btn.previousElementSibling;
        textBlock.classList.toggle('short');
        if (textBlock.classList.contains('short')) {
            btn.textContent = 'Читать далее';
        } else {
            btn.textContent = 'Свернуть';
        }
    });
});


// Имитация базы данных статей
const initialArticles = [
    {
    id: 1,
    title: "Магия Горного Алтая",
    date: "15 сентября 2026",
    isoDate: "2026-09-15",
    text: "В этой статье я расскажу о нашем недельном походе к подножию Белухи. Мы прошли более 50 километров по красивейшим местам...",
    tags: "#алтай #поход #путешествия"
    },
    {
    id: 2,
    title: "Выходные в Калининграде",
    date: "10 сентября 2026",
    isoDate: "2026-09-10",
    text: "Калининград встретил нас европейской архитектурой и запахом моря.   Балтийская коса — обязательное место к посещению...",
    tags: "#калининград #балтика"
    },
    {
    id: 3,
    title: "Осенний Дагестан и каньоны",
    date: "05 сентября 2026",
    isoDate: "2026-09-05",
    text: "Сулакский каньон поражает своими масштабами. Бирюзовая вода реки Сулак и    огромные скалы оставляют неизгладимое впечатление...",
    tags: "#дагестан #каньон #кавказ"
    }
];


const postsContainer = document.getElementById('postsContainer');

function renderArticles(articlesArray) {
    // Очищаем контейнер перед каждым рендером, чтобы статьи не дублировались
    postsContainer.innerHTML = '';

     // Если ничего не найдено, выводим сообщение
    if (articlesArray.length === 0) {
        postsContainer.innerHTML = '<p class="noresults">Ничего не найдено 😢 </p>';
        return;
    }
    // Проходим циклом по каждому объекту в массиве
    articlesArray.forEach(article => {
        // Создаем HTML-шаблон для карточки статьи
        const articleHtml = `
            <article>
                <header>
                    <h3>${article.title}</h3>
                    <p>Опубликовано: <time datetime="${article.isoDate}">${article.date}</time></p>
                </header>
                <p>${article.text}</p>
                <footer>
                    <p>Теги: ${article.tags}</p>
                </footer>
            </article>
        `;

        // Вставляем сгенерированный HTML внутрь контейнера
        postsContainer.insertAdjacentHTML('beforeend', articleHtml);
    });
}
// Запускаем первичный рендер при загрузке страницы
renderArticles(initialArticles);


const searchInput = document.getElementById('searchInput');
// Слушаем событие ввода текста в поле поиска
searchInput.addEventListener('input', function(event) {
    // Переводим введенный текст в нижний регистр, чтобы поиск не зависел от больших/маленьких букв
    const searchText = event.target.value.toLowerCase().trim();
    // Фильтруем массив статей
    const filteredArticles = initialArticles.filter(article => {
        // Проверяем, содержит ли заголовок статьи введенный текст
    return article.title.toLowerCase().includes(searchText);
    });
    // Перерисовываем страницу с отфильтрованными статьями
     renderArticles(filteredArticles);
});


// Замените предыдущий обработчик searchInput на этот улучшенный вариант:
searchInput.addEventListener('input', function(event) {
    const searchText = event.target.value.toLowerCase().trim();
    const filteredArticles = initialArticles.filter(article => {
        const inTitle = article.title.toLowerCase().includes(searchText);
        const inText = article.text.toLowerCase().includes(searchText);
        const inTags = article.tags.toLowerCase().includes(searchText);
        // Если текст найден хотя бы в одном из мест — статья проходит фильтр
        return inTitle || inText || inTags;
    });
    renderArticles(filteredArticles);
});










