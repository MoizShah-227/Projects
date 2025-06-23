import axios from 'axios';

const apirequest =axios.create({
    // baseURL: 'http://localhost:5000/api',
    baseURL:'https://projects-1-7vmq.onrender.com/api',
    // withCredentials:true,  
    headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0'
  }
})

export default apirequest;
// 8647