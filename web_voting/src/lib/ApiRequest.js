import axios from 'axios';

const apirequest =axios.create({
    baseURL: 'http://localhost:5000/api',
    // baseURL:'https://clinic-web.onrender.com/api',
    withCredentials:true,  
})

export default apirequest;