# WebTerm Landing

Отдельная статическая лендинг-страница для [WebTerm](https://github.com/LLprod39/WebTerm).

**Live:** https://llprod39.github.io/WebTerm-Landing/

Не является частью приложения. Код продукта здесь не меняется.

## Online

Публикуется через **GitHub Pages** из ветки `main` (корень репозитория).

После правок:

```bash
git add -A
git commit -m "Update landing"
git push
```

Сайт обновится за 1–2 минуты.

## Локально

```bash
npx --yes serve .
# или
python -m http.server 5500
```

## Состав

| Путь | Назначение |
| --- | --- |
| `index.html` | Разметка |
| `css/styles.css` | Стили |
| `js/main.js` | Вкладки, copy, меню |
| `assets/favicon.svg` | Иконка |

## Тон

Ранняя стадия, без хайпа, с командами установки и ссылкой на GitHub.
