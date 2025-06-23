import axios from 'axios';

const apirequest =axios.create({
    // baseURL: 'http://localhost:5000/api',
    baseURL:'https://projects-1-7vmq.onrender.com/api',
    // withCredentials:true,  
})

export default apirequest;
// 8647