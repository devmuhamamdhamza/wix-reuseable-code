import { apiClient } from "backend/api/https-config.jsw";
import { getHeaders } from "backend/api/config.jsw";

export const getData = async (url, token, cbFunction) => {
    const headers = token ? await getHeaders(token) : await getHeaders()
    try {
        const response = await apiClient.get(url, { headers })
        if (response?.data) {
            cbFunction && cbFunction()
            return response.data
        }
    } catch (e) {
        const errorResponse = JSON.parse(e.message)
        return errorResponse
    }
}

export const postData = async (url, token, cbFunction, payload, isFormData) => {
    const headers = token ? await getHeaders(token, isFormData) : await getHeaders()
    try {
        console.log("request: ", payload);
        const response = await apiClient.post(url, payload, { headers })
        console.log("api response", response);
        if (response?.data) {
            cbFunction && cbFunction()
            return response.data
        }
    } catch (e) {
        const errorResponse = JSON.parse(e.message)
        console.log("errorResponse", errorResponse);
        return errorResponse
    }
}

export const putData = async (url, token, cbFunction, payload) => {
    const headers = token ? await getHeaders(token) : getHeaders()
    try {
        const response = await apiClient.put(url, payload, { headers })
        if (response?.data) {
            cbFunction && cbFunction()
            return response.data
        }
    } catch (e) {
        const errorResponse = JSON.parse(e.message)
        return errorResponse
    }
}

export const deleteData = async (url, token, cbFunction) => {
    const headers = token ? await getHeaders(token) : getHeaders()
    try {
        const response = await apiClient.delete(url, { headers })
        if (response?.data) {
            cbFunction && cbFunction()
            return response.data
        }
    } catch (e) {
        const errorResponse = JSON.parse(e.message)
        return errorResponse
    }
}