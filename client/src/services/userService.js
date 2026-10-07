import api from './api';

const getAll = (params = {}) => api.get('/users', { params }).then((res) => res.data);
const getTechnicians = () => getAll({ role: 'Technician' });
const getObservers = () => getAll({ role: 'Observer' });

export default { getAll, getTechnicians, getObservers };
