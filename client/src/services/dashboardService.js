import api from './api';

const getStats = () => api.get('/dashboard/stats').then((res) => res.data);

export default { getStats };
