import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Tabs,
  Tab,
  InputGroup,
  FormControl,
  Alert,
  Spinner,
} from "react-bootstrap";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import "./LoginRegisterForm.css";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";

function LoginRegisterForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [key, setKey] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { login, register, isLoading, error, clearError, isAuthenticated } =
    useAuthStore();
  const [formErrors, setFormErrors] = useState({});
  // Reset errors when switching tabs
  const handleTabSelect = (k) => {
    setKey(k);
    setFormErrors({});
    clearError();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearError();
      setFormErrors({});
    };
  }, [clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || "/";
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, location.state?.from?.pathname, navigate]);

  // Reset form errors when user starts typing
  const handleInputChange = (formType, field, value) => {
    clearError();
    setFormErrors((prev) => ({ ...prev, [`${formType}${field}`]: "" }));

    if (formType === "login") {
      setLoginData((prev) => ({ ...prev, [field]: value }));
    } else {
      setRegisterData((prev) => ({ ...prev, [field]: value }));
    }
  };
  const validateLoginForm = () => {
    const errors = {};
    if (!loginData.email.trim()) {
      errors.loginEmail = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      errors.loginEmail = "Email không hợp lệ";
    }
    if (!loginData.password) {
      errors.loginPassword = "Vui lòng nhập mật khẩu";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors = {};
    if (!registerData.email.trim()) {
      errors.registerEmail = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      errors.registerEmail = "Email không hợp lệ";
    }
    if (!registerData.password) {
      errors.registerPassword = "Vui lòng nhập mật khẩu";
    } else if (registerData.password.length < 6) {
      errors.registerPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (!registerData.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu không khớp";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (validateLoginForm()) {
      try {
        const result = await login(loginData.email, loginData.password);
        if (!result.success) {
          setFormErrors({
            loginGeneral: result.message || "Đăng nhập thất bại",
          });
        }
      } catch {
        setFormErrors({
          loginGeneral: "Có lỗi xảy ra khi đăng nhập",
        });
      }
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateRegisterForm();
    setFormErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const result = await register({
        email: registerData.email,
        password: registerData.password,
        confirmPassword: registerData.confirmPassword,
      });

      if (!result.success) {
        setFormErrors((prev) => ({
          ...prev,
          registerGeneral: result.message || "Đăng ký thất bại",
        }));
      }
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
          onSelect={handleTabSelect}
          className="custom-tabs mb-4"
          justify
        >
          <Tab eventKey="login" title="Đăng nhập">
            {" "}
            <Form onSubmit={handleLoginSubmit}>
              {(formErrors.loginGeneral || error) && (
                <Alert variant="danger" className="mb-3" dismissible>
                  {formErrors.loginGeneral || error}
                </Alert>
              )}

              <Form.Group className="mb-3" controlId="formPhoneOrEmail">
                <Form.Label>Số điện thoại/Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập..."
                  value={loginData.email}
                  onChange={(e) =>
                    handleInputChange("login", "email", e.target.value)
                  }
                  isInvalid={!!formErrors.loginEmail}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.loginEmail}
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
                      handleInputChange("login", "password", e.target.value)
                    }
                    isInvalid={!!formErrors.loginPassword}
                    disabled={isLoading}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword((prev) => !prev)}
                    size="sm"
                    disabled={isLoading}
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.loginPassword}
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Đang xử lý...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>

              <div className="text-center mb-2 text-muted">hoặc</div>

              <Button
                variant="outline-dark"
                className="w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
                disabled={isLoading}
              >
                <FaGoogle /> Đăng nhập bằng Google
              </Button>

              <Button
                variant="primary"
                className="w-100 d-flex align-items-center justify-content-center gap-2"
                disabled={isLoading}
              >
                <FaFacebookF /> Đăng nhập bằng Facebook
              </Button>
            </Form>
          </Tab>

          <Tab eventKey="register" title="Đăng ký">
            <Form onSubmit={handleRegisterSubmit}>
              {formErrors.registerGeneral && (
                <Alert variant="danger" className="mb-3">
                  {formErrors.registerGeneral}
                </Alert>
              )}

              <Form.Group className="mb-3" controlId="formPhoneOrEmail">
                <Form.Label>Số điện thoại/Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập..."
                  value={registerData.email}
                  onChange={(e) =>
                    handleInputChange("register", "email", e.target.value)
                  }
                  isInvalid={!!formErrors.registerEmail}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.registerEmail}
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
                      handleInputChange("register", "password", e.target.value)
                    }
                    isInvalid={!!formErrors.registerPassword}
                    disabled={isLoading}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword((prev) => !prev)}
                    size="sm"
                    disabled={isLoading}
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.registerPassword}
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
                      handleInputChange(
                        "register",
                        "confirmPassword",
                        e.target.value
                      )
                    }
                    isInvalid={!!formErrors.confirmPassword}
                    disabled={isLoading}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword((prev) => !prev)}
                    size="sm"
                    disabled={isLoading}
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    {formErrors.confirmPassword}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Button
                variant="danger"
                type="submit"
                className="w-100 rounded-pill mb-3"
                disabled={isLoading}
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

export default LoginRegisterForm;
