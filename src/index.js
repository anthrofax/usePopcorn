import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// import StarRating from './StarRating.jsx';

// function Test() {
//   const [rating, setRating] = useState(0);
//   return (
//     <>
//     <StarRating onSetRating={setRating}/>
//     <p style={{fontSize: '18px', marginTop:'12px'}}>Rating film adalah {rating} </p>
//     </>
//   )
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']}
    />
    <StarRating maxRating={10} size={24} color="aqua" defaultRating={3}/>
    <p style={{fontSize:'15px', marginBlock: '50px'}}>--------------------TEST FOR EXTERNAL SET STATE CHANGING ---------------</p>
    <Test/> */}
  </React.StrictMode>
);
