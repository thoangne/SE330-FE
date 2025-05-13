import { useState } from "react";
import {
  Form,
  Button,
  Tabs,
  Tab,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import "./LoginRegisterForm.css";

function LoginForm() {
  const [key, setKey] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!loginData.email.trim())
      newErrors.loginEmail = "Vui lòng nhập email hoặc số điện thoại.";
    if (!loginData.password)
      newErrors.loginPassword = "Vui lòng nhập mật khẩu.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Submit logic here
      console.log("Đăng nhập:", loginData);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!registerData.email.trim())
      newErrors.registerEmail = "Vui lòng nhập email hoặc số điện thoại.";
    if (!registerData.password)
      newErrors.registerPassword = "Vui lòng nhập mật khẩu.";
    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Submit logic here
      console.log("Đăng ký:", registerData);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div
        className="p-4 rounded shadow bg-white"
        style={{ width: "500px", minHeight: "600px" }}
      >
        <Tabs
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="custom-tabs mb-4"
          justify
        >
          <Tab eventKey="login" title="Đăng nhập">
            <Form onSubmit={handleLoginSubmit}>
              <Form.Group className="mb-3" controlId="formPhoneOrEmail">
                <Form.Label>Số điện thoại/Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập..."
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  isInvalid={!!errors.loginEmail}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.loginEmail}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-2" controlId="formPassword">
                <Form.Label>Mật khẩu</Form.Label>
                <InputGroup hasValidation>
                  <FormControl
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    isInvalid={!!errors.loginPassword}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword((prev) => !prev)}
                    size="sm"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    {errors.loginPassword}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <div className="d-flex justify-content-end mb-3">
                <a
                  href="/forgot-password"
                  className="text-danger text-decoration-none"
                  style={{ fontSize: "0.9rem" }}
                >
                  Quên mật khẩu?
                </a>
              </div>

              <Button
                variant="danger"
                type="submit"
                className="w-100 rounded-pill mb-3"
              >
                Đăng nhập
              </Button>

              <div className="text-center mb-2 text-muted">hoặc</div>

              <Button
                variant="outline-dark"
                className="w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
              >
                <FaGoogle /> Đăng nhập bằng Google
              </Button>

              <Button
                variant="primary"
                className="w-100 d-flex align-items-center justify-content-center gap-2"
              >
                <FaFacebookF /> Đăng nhập bằng Facebook
              </Button>
            </Form>
          </Tab>

          <Tab eventKey="register" title="Đăng ký">
            <Form onSubmit={handleRegisterSubmit}>
              <Form.Group className="mb-3" controlId="formPhoneOrEmail">
                <Form.Label>Số điện thoại/Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập..."
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  isInvalid={!!errors.registerEmail}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.registerEmail}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-2" controlId="formPassword">
                <Form.Label>Mật khẩu</Form.Label>
                <InputGroup hasValidation>
                  <FormControl
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    isInvalid={!!errors.registerPassword}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword((prev) => !prev)}
                    size="sm"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    {errors.registerPassword}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Xác nhận mật khẩu</Form.Label>
                <InputGroup hasValidation>
                  <FormControl
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    isInvalid={!!errors.confirmPassword}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword((prev) => !prev)}
                    size="sm"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Button
                variant="danger"
                type="submit"
                className="w-100 rounded-pill mb-3"
              >
                Đăng ký
              </Button>
            </Form>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default LoginForm;
