// ==========================================
// 1. ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ
// ==========================================
const themeButton = document.getElementById('themeBtn');
if (themeButton) {
    themeButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeButton.textContent = '☀ Светлая тема';
        } else {
            themeButton.textContent = '🌙 Темная тема';
        }
    });
}

// ==========================================
// 2. БАЗА ДАННЫХ СТАТЕЙ (ДЛЯ ГЛАВНОЙ СТРАНИЦЫ)
// ==========================================
let articlesData = JSON.parse(localStorage.getItem('myBlogPosts')) || [
    {
        id: 1,
        title: "Почему важно питаться правильно",
        date: "25 октября 2026",
        isoDate: "2026-10-25",
        content: `
            <ul>
                <li>Повышает энергию и работоспособность</li>
                <li>Укрепляет иммунитет</li>
                <li>Улучшает состояние кожи и волос</li>
                <li>Нормализует вес</li>
                <li>Снижает риск хронических заболеваний</li>
            </ul>
        `,
        tags: "#вес #здоровье #иммунитет #энергия"
    },
    {
        id: 2,
        title: "Примерный рацион на день",
        date: "25 октября 2026",
        isoDate: "2026-10-25",
        content: `
            <h4>Завтрак: 07:30 - 08:30</h4>
            <p>Овсянка с ягодами и орехами</p>
            <h4>Обед: 12:30 - 13:30</h4>
            <p>Куриная грудка с гречкой и овощами</p>
            <h4>Ужин: 18:30 - 19:30</h4>
            <p>Запечённая рыба с салатом</p>
        `,
        tags: "#завтрак #обед #ужин"
    },
    {
        id: 3,
        title: "Простые советы для начала",
        date: "25 октября 2026",
        isoDate: "2026-10-25",
        content: `
            <ul>
                <li>Пейте больше воды (1,5-2 литра в день)</li>
                <li>Ешьте больше овощей и фруктов</li>
                <li>Не пропускайте завтрак</li>
                <li>Ограничьте сахар и фастфуд</li>
            </ul>
        `,
        tags: "#вода #фрукты #овощи"
    }
];

// ==========================================
// 3. ФУНКЦИИ ДЛЯ КНОПОК (Лайк и Читать далее)
// ==========================================

function handleLike(event) {
    const button = event.currentTarget;
    const countSpan = button.querySelector('.likecount');
    let currentLikes = parseInt(countSpan.textContent);

    // Проверяем, есть ли у кнопки класс "liked" (значит, лайк уже стоит)
    if (button.classList.contains('liked')) {
        // Если лайк уже есть — убираем его
        button.classList.remove('liked');
        countSpan.textContent = currentLikes - 1;
        button.style.backgroundColor = ''; // Возвращаем стандартный цвет фона
        button.style.color = '';           // Возвращаем стандартный цвет текста
    } else {
        // Если лайка нет — ставим его
        button.classList.add('liked');
        countSpan.textContent = currentLikes + 1;
        button.style.backgroundColor = '#e74c3c'; // Красный цвет при лайке
        button.style.color = 'white';
    }
}

// Навешиваем события на новые кнопки (используется при рендере)
function attachEventListeners() {
    document.querySelectorAll('.like-btn').forEach(button => {
        // Сначала удаляем старый обработчик, чтобы не было двойных кликов при поиске
        button.removeEventListener('click', handleLike);
        button.addEventListener('click', handleLike);
    });
    document.querySelectorAll('.read-more-btn').forEach(btn => {
        btn.removeEventListener('click', handleReadMore);
        btn.addEventListener('click', handleReadMore);
    });
}

// ==========================================
// 4. РЕНДЕР (Отрисовка) СТАТЕЙ НА ГЛАВНОЙ
// ==========================================
const postsContainer = document.getElementById('postsContainer');

function renderArticles(articlesArray) {
    if (!postsContainer) return; // Если мы не на главной странице, ничего не делаем

    postsContainer.innerHTML = ''; // Очищаем контейнер

    if (articlesArray.length === 0) {
        postsContainer.innerHTML = '<p class="noresults">Ничего не найдено 😢 </p>';
        return;
    }

    articlesArray.forEach(article => {
        const articleHtml = `
            <article>
                <header>
                    <h3>${article.title}</h3>
                    <p>Опубликовано: <time datetime="${article.isoDate}">${article.date}</time></p>
                </header>
                <div class="article-text short">
                    ${article.content}
                </div>
                <button class="read-more-btn">Читать далее</button>
                <footer>
                    <p>${article.tags}</p>
                    <button class="like-btn">❤ Лайк (<span class="likecount">0</span>)</button>
                </footer>
            </article>
        `;
        postsContainer.insertAdjacentHTML('beforeend', articleHtml);
    });

    // Обязательно навешиваем события после того, как HTML вставлен
    attachEventListeners();
}

// Первичный запуск рендера (если мы на главной)
renderArticles(articlesData);

// ==========================================
// 5. ЖИВОЙ ПОИСК
// ==========================================
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', function(event) {
        const searchText = event.target.value.toLowerCase().trim();
        
        const filteredArticles = articlesData.filter(article => {
            // Очищаем HTML-теги, чтобы искать по чистому тексту
            const cleanContent = article.content.replace(/<[^>]+>/g, ' ').toLowerCase();
            const inTitle = article.title.toLowerCase().includes(searchText);
            const inText = cleanContent.includes(searchText);
            const inTags = article.tags.toLowerCase().includes(searchText);
            return inTitle || inText || inTags;
        });
        
        renderArticles(filteredArticles);
    });
}

// ==========================================
// 6. СКРИПТ ДЛЯ СТРАНИЦЫ РЕЦЕПТОВ (recipes.html)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, есть ли на странице картинки рецептов. Если да — значит, мы на recipes.html
    if (document.querySelector('.recipe-img')) {
        
        // Оживляем кнопки лайков и "Читать далее" вручную
        const recipeLikeBtns = document.querySelectorAll('.like-btn');
        recipeLikeBtns.forEach(button => {
            button.addEventListener('click', handleLike);
        });

        const recipeReadMoreBtns = document.querySelectorAll('.read-more-btn');
        recipeReadMoreBtns.forEach(btn => {
            btn.addEventListener('click', handleReadMore);
        });
    }
});

// ==========================================
// 7. ДОБАВЛЕНИЕ НОВЫХ СТАТЕЙ (ФОРМА ИЗ ПР7)
// ==========================================
const addForm = document.getElementById('addArticleForm');

if (addForm) {
    addForm.addEventListener('submit', function(event) {
        // Отменяем перезагрузку страницы
        event.preventDefault(); 

        const postTitleInput = document.getElementById('postTitle');
        const postTextInput = document.getElementById('postText');
        const postTagsInput = document.getElementById('postTags');

        const titleValue = postTitleInput.value.trim();
        const textValue = postTextInput.value.trim();
        const tagsValue = postTagsInput.value.trim() || "#здоровье"; // Тег по умолчанию

        // --- ПРОСТАЯ ВАЛИДАЦИЯ ---
        if (titleValue.length < 5) {
            alert('Ошибка: Заголовок статьи должен быть не короче 5 символов!');
            return; // Останавливаем выполнение
        }
        if (textValue.length < 20) {
            alert('Ошибка: Описание слишком короткое. Расскажите подробнее (минимум 20 символов)!');
            return;
        }

        // Формируем дату
        const today = new Date();
        const formattedDate = today.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
        const isoDate = today.toISOString().split('T')[0];

        // Создаем объект новой статьи
        const newArticle = {
            id: articlesData.length + 1,
            title: titleValue,
            date: formattedDate,
            isoDate: isoDate,
            // Оборачиваем текст в тег <p>, чтобы он красиво отображался
            content: `<p>${textValue}</p>`, 
            tags: tagsValue
        };

        // Добавляем статью в начало массива
        articlesData.unshift(newArticle);

        // СОХРАНЯЕМ В ПАМЯТЬ БРАУЗЕРА (LocalStorage)
        localStorage.setItem('myBlogPosts', JSON.stringify(articlesData));

        // Перерисовываем список статей и очищаем форму
        renderArticles(articlesData);
        addForm.reset();
    });
}