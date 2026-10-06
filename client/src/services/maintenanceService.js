import api from './api';

const getAll = (params = {}) => api.get('/maintenance', { params }).then((res) => res.data);
const getById = (id) => api.get(`/maintenance/${id}`).then((res) => res.data);
const create = (payload) => api.post('/maintenance', payload).then((res) => res.data);
const update = (id, payload) => api.put(`/maintenance/${id}`, payload).then((res) => res.data);
const remove = (id) => api.delete(`/maintenance/${id}`).then((res) => res.data);

export default { getAll, getById, create, update, remove };
