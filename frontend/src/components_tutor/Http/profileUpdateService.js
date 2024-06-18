// profileUpdateService.js
import getUrlParameter from "./URLextractor";

const userIdFromUrl = getUrlParameter('userID') || 'defaultUserID'; // Используйте значение по умолчанию, если параметр не найден


/**
 * Отправляет обновленные данные профиля на сервер.
 * @param {string} id - Идентификатор профиля.
 * @param {string} name - Имя профиля.
 * @param {string} surname - Фамилия профиля.
 * @param {string} description - Описание профиля.
 * @returns {Object|null} Ответ от сервера или null, если произошла ошибка.
 */
async function updateProfile(id, name, surname, description) {
    try {
        // Формируем URL с необходимыми параметрами
        const response = await fetch(`http://26.193.156.41:5000/profile_change/${userIdFromUrl}/${name}/${surname}/${encodeURIComponent(description)}`, {
            method: 'GET',
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        return null;
    }
}

export default updateProfile;
