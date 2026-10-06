import api from './api';

const getCurrent = () => api.get('/weather').then((res) => res.data);

export default { getCurrent };
