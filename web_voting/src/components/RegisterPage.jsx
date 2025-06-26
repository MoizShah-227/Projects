import React, { useState } from 'react';
import logo from '../img/logo 1.png';
import side from '../img/Side Image.svg';
import './registerpage.css';
import { useNavigate } from 'react-router-dom';
import apirequest from '../lib/ApiRequest';
import LandingAnimation from './LoadingAnimation'; // 👈 Import the loader

const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [section, setSection] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false); // 👈 loading state

  const formatDateToMMDDYYYY = (inputDate) => {
    const date = new Date(inputDate);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const handleRegister = async () => {
    if (!name || !cnic || !dob || !phone || !email || !password || !studentClass || !section || !gender) {
      alert('⚠️ All fields are required!');
      return;
    }

    const formattedDob = formatDateToMMDDYYYY(dob);

    setLoading(true); // 👈 show animation

    try {
      const response = await apirequest.post('/register', {
        name,
        cnic,
        dob: formattedDob,
        phone,
        email,
        password,
        studentClass,
        section,
        gender,
      });

      alert('✅ Registration successful!');
      navigate('/login');
    } catch (error) {
      const msg = error?.response?.data?.message || 'Something went wrong!';
      alert(`❌ ${msg}`);
    } finally {
      setLoading(false); // 👈 hide animation
    }
  };

  return (
    <>
      {loading && <LandingAnimation />} {/* 👈 Show loader */}

      <div className='register'>
        <nav className='nav'>
          <div>
            <img src={logo} alt="logo" />
            <h4>VoteChain</h4>
          </div>
        </nav>

        <div className='login-section'>
          <div className='row'>
            <div className='col-lg-6 col-sm-12 left-side'>
              <img src={side} className='side-img' alt="illustration" />
            </div>

            <div className='col-lg-6 col-sm-12'>
              <div className='form-section p-2'>
                <input
                  type="text"
                  placeholder='Full Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder='CNIC'
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                />
                <input
                  type="date"
                  placeholder='Date of Birth'
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
                <input
                  type="text"
                  placeholder='Phone Number'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input
                  type="text"
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* New Fields */}
                <input
                  type="text"
                  placeholder='BSCS-1'
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                />
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                  >
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                <button className='btn' onClick={handleRegister} disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>

                <div>
                  <a href="/">Back to home</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
