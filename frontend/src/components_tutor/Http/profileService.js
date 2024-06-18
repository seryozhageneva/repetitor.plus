// profileService.js

/**
 * Fetches profile data from the provided URL.
 * @returns {Object|null} The profile data if successful, or null if an error occurs.
 */
async function fetchProfileData() {
    try {
        const response = await fetch('http://26.193.156.41:5000/profile/kirill@mail.ru');
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
