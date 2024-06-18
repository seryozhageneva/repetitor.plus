import getUrlParameter from "./URLextractor";

const userIdFromUrl = getUrlParameter('userID') || 'defaultUserID'; // Используйте значение по умолчанию, если параметр не найден

/**
 * Fetches profile data from the provided URL.
 * @returns {Object|null} The profile data if successful, or null if an error occurs.
 */
async function fetchProfileData() {
    try {
        if (!userIdFromUrl) {
            throw new Error('User ID is not provided in the URL');
        }

        // Использование шаблонной строки для интерполяции переменной в URL
        const response = await fetch(`http://26.193.156.41:5000/profile/${userIdFromUrl}`);

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

export default fetchProfileData;
