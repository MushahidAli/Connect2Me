import { useState } from 'react'
import { InputGroup } from 'react-bootstrap'
import { FiEyeOff, FiEye } from 'react-icons/fi'

export const PasswordInput = (props) => {
  const [passwordType, setPasswordType] = useState("password");

  const onTypeChange = () => {
    if (passwordType === "text") {
      setPasswordType("password");
    } else {
      setPasswordType("text");
    }
  };
  return (
    <InputGroup className="d-flex flex-nowrap align-items-center input-group-main">
      <input {...props} className="input-element" type={passwordType} />
        <span style={{position: 'absolute', right: '0px'}}>{passwordType === "password" ? (
          <FiEyeOff onClick={onTypeChange} />
        ) : (
          <FiEye onClick={onTypeChange} />
        )}</span>
    </InputGroup>
  );
};
