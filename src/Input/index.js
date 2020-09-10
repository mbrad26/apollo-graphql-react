import React from 'react';

import './style.css';

const Input = ({ children, color = 'black', onChange }) => (
  <input
    className={`Input Input_${color}`}
    onChange={onChange}
  >
    {children}
  </input>
);


export default Input;
