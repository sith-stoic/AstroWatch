import api from './api';

const getAll = (params = {}) => api.get('/observations', { params }).then((res) => res.data);
const getById = (id) => api.get(`/observations/${id}`).then((res) => res.data);
const create = (payload) => api.post('/observations', payload).then((res) => res.data);
const update = (id, payload) => api.put(`/observations/${id}`, payload).then((res) => res.data);
const remove = (id) => api.delete(`/observations/${id}`).then((res) => res.data);

export default { getAll, getById, create, update, remove };
