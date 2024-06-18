/**
 * Получает значение параметра из URL.
 * @param {string} paramName Имя параметра.
 * @returns {string|null} Значение параметра или null, если параметр не найден.
 */
const getUrlParameter = (paramName) => {
    // Использование window.location для получения текущего URL.
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(paramName);
};

export default getUrlParameter;
