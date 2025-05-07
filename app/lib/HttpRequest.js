const axios = require('axios');

class HttpRequest {
    // Function to make a GET request
	async get(url, authorization) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization
            }
        };
        const response = await axios.get(`${url}`, config);
        return response.data;
    }

    // Function to make a POST request
    async post(url, requestData, authorization) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            }
        };
        const response = await axios.post(`${url}`, JSON.stringify(requestData), config);
        return response.data;
    }

    // Function to make a DELETE request
    async delete(url, requestData, authorization) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            }
        };
        const response = await axios.delete(`${url}`, JSON.stringify(requestData), config);
        return response.data;
    }

    // Function to make a PUT request to Ryft API
    async put(url, requestData, authorization) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
            }
        }
        const response = await axios.put(`${url}`, JSON.stringify(requestData), config);
        return response.data;
    }

    // Function to make a PATCH request to Ryft API
    async patch(url, requestData, authorization) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization
            }
        }
        const response = await axios.patch(`${url}`, JSON.stringify(requestData), config);
        return response.data;
    }
};

module.exports = HttpRequest;