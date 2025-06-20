import React from "react";
import { toast } from "react-hot-toast";

class AuthErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Auth Error Boundary caught an error:", error, errorInfo);

    toast.error("Có lỗi xảy ra với hệ thống xác thực. Vui lòng tải lại trang.");

    // In production, you might want to send this to an error reporting service
    if (import.meta.env.PROD) {
      // Example: Sentry.captureException(error);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="text-center">
            <h2 className="text-danger mb-3">Oops! Có lỗi xảy ra</h2>
            <p className="text-muted mb-4">
              Hệ thống xác thực gặp sự cố. Vui lòng thử lại.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <button className="btn btn-primary" onClick={this.handleRetry}>
                Tải lại trang
              </button>
              <a href="/" className="btn btn-outline-secondary">
                Về trang chủ
              </a>
            </div>
            {import.meta.env.DEV && (
              <details className="mt-4 text-start">
                <summary className="btn btn-link">
                  Chi tiết lỗi (Dev only)
                </summary>
                <pre className="text-danger small mt-2">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;
