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
            <Form>
              <Form.Group className="mb-3" controlId="formPhoneOrEmail">
                <Form.Label>Số điện thoại/Email</Form.Label>
                <Form.Control type="text" placeholder="Nhập..." />
              </Form.Group>

              <Form.Group className="mb-2" controlId="formPassword">
                <Form.Label>Mật khẩu</Form.Label>
                <InputGroup>
                  <FormControl
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword((prev) => !prev)}
                    size="sm"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </Button>
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
            <Form>
              <Form.Group className="mb-3" controlId="formPhoneOrEmail">
                <Form.Label>Số điện thoại/Email</Form.Label>
                <Form.Control type="text" placeholder="Nhập..." />
              </Form.Group>

              <Form.Group className="mb-2" controlId="formPassword">
                <Form.Label>Mật khẩu</Form.Label>
                <InputGroup>
                  <FormControl
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword((prev) => !prev)}
                    size="sm"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Xác nhận mật khẩu</Form.Label>
                <InputGroup>
                  <FormControl
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword((prev) => !prev)}
                    size="sm"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button
                variant="danger"
                type="submit"
                className="w-100  rounded-pill mb-3 "
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
