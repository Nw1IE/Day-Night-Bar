// Проверяет готовую сборку, не обращаясь к серверу и не изменяя файлы.
import { readFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = new URL('../dist/', import.meta.url);
const expectedUrl = 'https://day-night-bar.ru/';
const read = (name) => readFile(new URL(name, dist), 'utf8');
const errors = [];
const check = (condition, message) => {
    if (!condition) errors.push(message);
};

try {
    const [html, robots, sitemap] = await Promise.all([
        read('index.html'), read('robots.txt'), read('sitemap.xml')
    ]);
    check(/<html\s+lang="ru"/i.test(html), 'Не указан русский язык страницы.');
    check(/<title>[^<]+<\/title>/i.test(html), 'Отсутствует title.');
    check(/<meta\s+name="description"\s+content="[^"]+"/i.test(html), 'Отсутствует description.');
    check(html.includes(`rel="canonical" href="${expectedUrl}"`), 'Неверный canonical.');
    check((html.match(/<h1(?:\s[^>]*)?>/gi) || []).length === 1, 'В исходном HTML должен быть один H1.');
    check(html.includes('Берёзовский') && html.includes('+7 (922) 147-70-81'), 'В исходном HTML отсутствуют контакты.');
    check(/User-agent:\s*\*/i.test(robots) && !/Disallow:\s*\/(?:\s|$)/im.test(robots), 'Проверьте доступ роботов к сайту.');
    check(robots.includes(`Sitemap: ${expectedUrl}sitemap.xml`), 'Неверная ссылка на sitemap в robots.txt.');
    check(sitemap.includes(`<loc>${expectedUrl}</loc>`), 'Главная страница отсутствует в sitemap.');

    const schemaText = html.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1];
    try {
        const schema = JSON.parse(schemaText);
        check(schema['@type'] === 'BarOrPub' && schema.url === expectedUrl, 'Проверьте данные BarOrPub.');
    } catch {
        errors.push('JSON-LD отсутствует или содержит ошибку.');
    }

    const favicon = html.match(/<link\s+rel="icon"\s+href="([^"]+)"/i)?.[1];
    if (!favicon || !favicon.startsWith('/') || favicon.includes('..')) {
        errors.push('Не найден локальный favicon в собранном HTML.');
    } else {
        try { await access(join(fileURLToPath(dist), decodeURIComponent(favicon.slice(1)))); }
        catch { errors.push(`Файл favicon отсутствует в сборке: ${favicon}`); }
    }
} catch (error) {
    errors.push(`Не удалось прочитать сборку: ${error.message}. Сначала выполните npm run build.`);
}

if (errors.length) {
    for (const error of errors) console.error(`Ошибка: ${error}`);
    process.exitCode = 1;
} else {
    console.log('SEO-проверка сборки пройдена. Доступность сайта и API проверяются отдельно после развёртывания.');
}
