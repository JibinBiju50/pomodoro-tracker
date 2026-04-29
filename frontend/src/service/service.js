const API_URL = 'http://localhost:3000';

//helper function to handle responses
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
}

//helper function to fetch options
const fetchOptions = (method, body) => ({
    method,
    headers: {
        'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...(body && {body: JSON.stringify(body)})
})

export const authService = {
    async register(username, password) {
        const response = await fetch(`${API_URL}/api/register`,
            fetchOptions('POST', {username, password})
        );
        return handleResponse(response);
    },

    async login(username, password) {
        const response = await fetch(`${API_URL}/api/login`,
            fetchOptions('POST', {username, password})
        );
        return handleResponse(response);
    },
    async logout() {
        const response = await fetch(`${API_URL}/api/logout`,
            fetchOptions('POST')
        );
        return handleResponse(response);
    },
    async getAuthStatus() {
        const response = await fetch(`${API_URL}/api/auth-status`,{
            credentials: 'include'
        });
        return handleResponse(response);
    },

    async getDashboardData() {
        const response = await fetch(`${API_URL}/api/dashboard`,{
            credentials: 'include'
        });
        return handleResponse(response);
    }
}

export const profileService = {
    // Get user profile
    async getProfile() {
        const response = await fetch(`${API_URL}/api/profile`, {
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Update username
    async updateUsername(username) {
        const response = await fetch(`${API_URL}/api/profile/username`,
            fetchOptions('PUT', { username })
        );
        return handleResponse(response);
    },

    // Update password
    async updatePassword(currentPassword, newPassword) {
        const response = await fetch(`${API_URL}/api/profile/password`,
            fetchOptions('PUT', { currentPassword, newPassword })
        );
        return handleResponse(response);
    },

    // Delete account
    async deleteAccount(password) {
        const response = await fetch(`${API_URL}/api/profile`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ password })
        });
        return handleResponse(response);
    }
}

export const taskService = {
    // Get all tasks
    async getTasks() {
        const response = await fetch(`${API_URL}/api/tasks`, {
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Create a new task
    async createTask(title) {
        const response = await fetch(`${API_URL}/api/tasks`,
            fetchOptions('POST', { title })
        );
        return handleResponse(response);
    },

    // Update a task
    async updateTask(id, updates) {
        const response = await fetch(`${API_URL}/api/tasks/${id}`,
            fetchOptions('PUT', updates)
        );
        return handleResponse(response);
    },

    // Delete a task
    async deleteTask(id) {
        const response = await fetch(`${API_URL}/api/tasks/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        return handleResponse(response);
    },

    // Add pomodoro to task
    async addPomodoro(id) {
        const response = await fetch(`${API_URL}/api/tasks/${id}/pomodoro`,
            fetchOptions('PUT')
        );
        return handleResponse(response);
    }
}

