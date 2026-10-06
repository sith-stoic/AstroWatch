import api from './api';

const getAll = (params = {}) => api.get('/equipment', { params }).then((res) => res.data);
const getById = (id) => api.get(`/equipment/${id}`).then((res) => res.data);
const create = (payload) => api.post('/equipment', payload).then((res) => res.data);
const update = (id, payload) => api.put(`/equipment/${id}`, payload).then((res) => res.data);
const remove = (id) => api.delete(`/equipment/${id}`).then((res) => res.data);

export default { getAll, getById, create, update, remove };
